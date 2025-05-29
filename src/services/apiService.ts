// API configuration and service functions
const API_CONFIG = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o'
  },
  cohere: {
    baseUrl: 'https://api.cohere.ai/v1',
    model: 'command-r-plus'
  },
  affinda: {
    baseUrl: 'https://api.affinda.com/v3'
  }
};

// TODO: Replace these with your actual API keys
const API_KEYS = {
  openai: 'your-openai-api-key-here',
  cohere: 'your-cohere-api-key-here',
  affinda: 'your-affinda-api-key-here'
};

export interface ParsedResume {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
    technologies: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    impact?: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  certifications: string[];
}

export interface AIAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  suggestions: string[];
  sectionScores: {
    skills: number;
    experience: number;
    projects: number;
    education: number;
  };
  atsCompatibility: number;
  keywordDensity: number;
}

export interface JobRecommendation {
  skill: string;
  relatedSkills: string[];
  jobCount: number;
  linkedinUrl: string;
  salaryRange?: string;
  demandLevel: 'High' | 'Medium' | 'Low';
}

class APIService {
  private getApiKey(service: 'openai' | 'cohere' | 'affinda'): string {
    const key = API_KEYS[service];
    if (!key || key.includes('your-') || key.includes('-here')) {
      throw new Error(`${service.toUpperCase()} API key not configured. Please add your API key to the API_KEYS object in apiService.ts`);
    }
    return key;
  }

  async parseResume(file: File): Promise<ParsedResume> {
    const apiKey = this.getApiKey('affinda');
    if (!apiKey) {
      throw new Error('Affinda API key not found. Please add it in settings.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_CONFIG.affinda.baseUrl}/resumes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Resume parsing failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform Affinda response to our format
      return {
        personalInfo: {
          name: data.data?.name?.raw || 'Unknown',
          email: data.data?.emails?.[0]?.value || '',
          phone: data.data?.phoneNumbers?.[0]?.value || '',
          location: data.data?.location?.formatted || ''
        },
        skills: data.data?.skills?.map((skill: any) => skill.name) || [],
        experience: data.data?.workExperience?.map((exp: any) => ({
          title: exp.jobTitle || '',
          company: exp.organization || '',
          duration: `${exp.startDate} - ${exp.endDate || 'Present'}`,
          description: exp.jobDescription || '',
          technologies: exp.skills?.map((skill: any) => skill.name) || []
        })) || [],
        projects: data.data?.projects?.map((proj: any) => ({
          name: proj.name || '',
          description: proj.description || '',
          technologies: proj.skills?.map((skill: any) => skill.name) || [],
          impact: proj.impact
        })) || [],
        education: data.data?.education?.map((edu: any) => ({
          degree: edu.accreditation?.education || '',
          institution: edu.organization || '',
          year: edu.endDate || ''
        })) || [],
        certifications: data.data?.certifications?.map((cert: any) => cert.name) || []
      };
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw error;
    }
  }

  async analyzeResume(parsedResume: ParsedResume): Promise<AIAnalysis> {
    const apiKey = this.getApiKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please add it in settings.');
    }

    const prompt = `
    Analyze this resume data and provide a comprehensive assessment:
    
    Personal Info: ${JSON.stringify(parsedResume.personalInfo)}
    Skills: ${parsedResume.skills.join(', ')}
    Experience: ${JSON.stringify(parsedResume.experience)}
    Projects: ${JSON.stringify(parsedResume.projects)}
    Education: ${JSON.stringify(parsedResume.education)}
    
    Provide analysis in this JSON format:
    {
      "overallScore": number (0-100),
      "strengths": ["strength1", "strength2", ...],
      "weaknesses": ["weakness1", "weakness2", ...],
      "skillGaps": ["missing skill 1", "missing skill 2", ...],
      "suggestions": ["suggestion1", "suggestion2", ...],
      "sectionScores": {
        "skills": number (0-100),
        "experience": number (0-100),
        "projects": number (0-100),
        "education": number (0-100)
      },
      "atsCompatibility": number (0-100),
      "keywordDensity": number (0-100)
    }
    
    Focus on technical accuracy, quantifiable achievements, ATS optimization, and industry relevance.
    `;

    try {
      const response = await fetch(`${API_CONFIG.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: API_CONFIG.openai.model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert resume analyst and career counselor. Provide detailed, actionable feedback in valid JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`AI analysis failed: ${response.statusText}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Parse the JSON response
      const analysis = JSON.parse(analysisText);
      return analysis;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw error;
    }
  }

  async generateJobRecommendations(skills: string[], projects: Array<{name: string, technologies: string[]}>): Promise<JobRecommendation[]> {
    const apiKey = this.getApiKey('cohere');
    if (!apiKey) {
      throw new Error('Cohere API key not found. Please add it in settings.');
    }

    // Combine skills and project technologies
    const allTechnologies = [...skills];
    projects.forEach(project => {
      allTechnologies.push(...project.technologies);
    });
    
    // Remove duplicates and filter relevant tech skills
    const uniqueSkills = [...new Set(allTechnologies)].filter(skill => skill.length > 2);

    const prompt = `
    Based on these technical skills and project technologies: ${uniqueSkills.join(', ')}
    
    Generate job recommendations with market insights. For each skill/technology, provide:
    1. Related complementary skills
    2. Current job market demand level
    3. Estimated salary range (if applicable)
    4. LinkedIn job search optimization
    
    Return as JSON array with this format:
    [
      {
        "skill": "skill name",
        "relatedSkills": ["related1", "related2", ...],
        "demandLevel": "High|Medium|Low",
        "salaryRange": "estimated range",
        "linkedinUrl": "optimized LinkedIn search URL"
      }
    ]
    
    Focus on the top 10 most marketable skills from the list.
    `;

    try {
      const response = await fetch(`${API_CONFIG.cohere.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: API_CONFIG.cohere.model,
          message: prompt,
          temperature: 0.3,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        throw new Error(`Job recommendations failed: ${response.statusText}`);
      }

      const data = await response.json();
      const recommendationsText = data.text;
      
      // Parse the JSON response
      const recommendations = JSON.parse(recommendationsText);
      
      // Enhance with proper LinkedIn URLs
      return recommendations.map((rec: any) => ({
        ...rec,
        linkedinUrl: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(rec.skill + ' ' + rec.relatedSkills.slice(0, 2).join(' '))}&location=Worldwide`,
        jobCount: Math.floor(Math.random() * 5000) + 500 // Simulated for demo
      }));
    } catch (error) {
      console.error('Job recommendations error:', error);
      throw error;
    }
  }

  async enhanceSkillSemantics(skills: string[]): Promise<string[]> {
    const apiKey = this.getApiKey('cohere');
    if (!apiKey) return skills;

    try {
      const response = await fetch(`${API_CONFIG.cohere.baseUrl}/embed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          texts: skills,
          model: 'embed-english-v3.0',
          input_type: 'classification'
        })
      });

      if (!response.ok) {
        throw new Error(`Skill enhancement failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Use embeddings to find similar industry-standard terms
      // This is a simplified implementation - in production, you'd compare against a database of standard skills
      return skills.map(skill => {
        // Normalize common variations
        const normalized = skill
          .replace(/javascript/i, 'JavaScript')
          .replace(/react\.js/i, 'React')
          .replace(/node\.js/i, 'Node.js')
          .replace(/ai\/ml/i, 'Artificial Intelligence')
          .replace(/ui\/ux/i, 'UI/UX Design');
        return normalized;
      });
    } catch (error) {
      console.error('Skill enhancement error:', error);
      return skills;
    }
  }
}

export const apiService = new APIService();
