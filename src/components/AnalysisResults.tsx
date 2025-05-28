
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  RotateCcw,
  Download,
  Briefcase,
  User,
  GraduationCap,
  Code,
  Target,
  DollarSign
} from "lucide-react";
import { ParsedResume, AIAnalysis, JobRecommendation } from "@/services/apiService";

interface AnalysisResultsProps {
  fileName: string;
  parsedResume: ParsedResume;
  aiAnalysis: AIAnalysis;
  jobRecommendations: JobRecommendation[];
  onReset: () => void;
}

export const AnalysisResults = ({ 
  fileName, 
  parsedResume, 
  aiAnalysis, 
  jobRecommendations,
  onReset 
}: AnalysisResultsProps) => {

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">Analysis Complete</h2>
              <p className="text-muted-foreground">{fileName}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Analyze New
            </Button>
          </div>
        </div>
      </Card>

      {/* Overall Score */}
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold">Overall Resume Score</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${getScoreColor(aiAnalysis.overallScore)}`}>
              {aiAnalysis.overallScore}/100
            </span>
            <span className={`text-sm font-medium ${getScoreColor(aiAnalysis.overallScore)}`}>
              {getScoreLabel(aiAnalysis.overallScore)}
            </span>
          </div>
          <Progress value={aiAnalysis.overallScore} className="h-3" />
          
          {/* Section Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className={`text-lg font-semibold ${getScoreColor(aiAnalysis.sectionScores.skills)}`}>
                {aiAnalysis.sectionScores.skills}
              </div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getScoreColor(aiAnalysis.sectionScores.experience)}`}>
                {aiAnalysis.sectionScores.experience}
              </div>
              <div className="text-sm text-muted-foreground">Experience</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getScoreColor(aiAnalysis.sectionScores.projects)}`}>
                {aiAnalysis.sectionScores.projects}
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className={`text-lg font-semibold ${getScoreColor(aiAnalysis.atsCompatibility)}`}>
                {aiAnalysis.atsCompatibility}
              </div>
              <div className="text-sm text-muted-foreground">ATS Score</div>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="profile">Profile Data</TabsTrigger>
          <TabsTrigger value="jobs">Job Market</TabsTrigger>
          <TabsTrigger value="recommendations">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {aiAnalysis.strengths.map((strength, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Areas for Improvement */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold">Areas for Improvement</h3>
              </div>
              <ul className="space-y-2">
                {aiAnalysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="text-sm flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Skill Gaps */}
          {aiAnalysis.skillGaps.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold">Recommended Skills to Add</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.skillGaps.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile" className="space-y-6">
          {/* Personal Info */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Personal Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{parsedResume.personalInfo.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="font-medium">{parsedResume.personalInfo.email}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">{parsedResume.personalInfo.phone}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div className="font-medium">{parsedResume.personalInfo.location}</div>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Extracted Skills ({parsedResume.skills.length})</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {parsedResume.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Experience */}
          {parsedResume.experience.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Work Experience</h3>
              </div>
              <div className="space-y-4">
                {parsedResume.experience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-4">
                    <div className="font-semibold">{exp.title}</div>
                    <div className="text-muted-foreground">{exp.company} • {exp.duration}</div>
                    {exp.description && (
                      <div className="text-sm mt-1">{exp.description}</div>
                    )}
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Education */}
          {parsedResume.education.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <GraduationCap className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">Education</h3>
              </div>
              <div className="space-y-2">
                {parsedResume.education.map((edu, index) => (
                  <div key={index}>
                    <div className="font-semibold">{edu.degree}</div>
                    <div className="text-muted-foreground">{edu.institution} • {edu.year}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Personalized Job Recommendations</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Based on your skills and experience, here are targeted job opportunities
            </p>
            
            <div className="grid gap-4">
              {jobRecommendations.map((job, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-lg">{job.skill}</div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={job.demandLevel === 'High' ? 'default' : 
                                job.demandLevel === 'Medium' ? 'secondary' : 'outline'}
                      >
                        {job.demandLevel} Demand
                      </Badge>
                      {job.salaryRange && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.salaryRange}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {job.relatedSkills.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm text-muted-foreground mb-1">Related Skills:</div>
                      <div className="flex flex-wrap gap-1">
                        {job.relatedSkills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      ~{job.jobCount.toLocaleString()} jobs available
                    </div>
                    <a
                      href={job.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button size="sm" variant="outline">
                        View Jobs
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">AI-Powered Action Items</h3>
            <div className="space-y-3">
              {aiAnalysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
