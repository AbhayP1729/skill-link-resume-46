
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  ExternalLink,
  RotateCcw,
  Download
} from "lucide-react";

interface AnalysisResultsProps {
  fileName: string;
  onReset: () => void;
}

// Mock data for demonstration
const mockAnalysis = {
  overallScore: 78,
  strengths: [
    "Strong technical skills in React and TypeScript",
    "Good project experience with full-stack development",
    "Clear educational background"
  ],
  weaknesses: [
    "Missing quantifiable achievements",
    "Limited leadership experience mentioned",
    "Could benefit from more industry certifications"
  ],
  skills: [
    "React", "TypeScript", "Node.js", "Python", "AWS", "Docker", 
    "MongoDB", "PostgreSQL", "Git", "CI/CD"
  ],
  suggestions: [
    "Add metrics to your achievements (e.g., 'Improved performance by 40%')",
    "Include soft skills and leadership examples",
    "Consider adding relevant certifications",
    "Optimize keywords for ATS systems"
  ]
};

export const AnalysisResults = ({ fileName, onReset }: AnalysisResultsProps) => {
  const generateLinkedInJobUrl = (skill: string) => {
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(skill)}`;
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
              Export PDF
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
          <h3 className="text-lg font-semibold">Overall Score</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{mockAnalysis.overallScore}/100</span>
            <span className="text-sm text-muted-foreground">Good</span>
          </div>
          <Progress value={mockAnalysis.overallScore} className="h-3" />
          <p className="text-sm text-muted-foreground">
            Your resume shows strong technical skills but could benefit from more quantifiable achievements.
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {mockAnalysis.strengths.map((strength, index) => (
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
            {mockAnalysis.weaknesses.map((weakness, index) => (
              <li key={index} className="text-sm flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Extracted Skills & Job Links */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Extracted Skills & Job Opportunities</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Click on any skill to explore relevant job opportunities on LinkedIn
        </p>
        <div className="flex flex-wrap gap-2">
          {mockAnalysis.skills.map((skill, index) => (
            <a
              key={index}
              href={generateLinkedInJobUrl(skill)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Badge 
                variant="secondary" 
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {skill}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Badge>
            </a>
          ))}
        </div>
      </Card>

      {/* Suggestions */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">AI Recommendations</h3>
        <div className="space-y-3">
          {mockAnalysis.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-secondary rounded-lg">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
