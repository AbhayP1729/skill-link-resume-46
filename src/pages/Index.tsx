
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { Brain } from "lucide-react";
import { apiService, ParsedResume, AIAnalysis, JobRecommendation } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [parsedResume, setParsedResume] = useState<ParsedResume | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([]);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    setAnalysisStep("Parsing resume...");
    
    try {
      // Step 1: Parse the resume
      console.log("Starting resume parsing...");
      const parsed = await apiService.parseResume(file);
      setParsedResume(parsed);
      console.log("Parsed resume:", parsed);
      
      setAnalysisStep("Analyzing with AI...");
      
      // Step 2: AI Analysis
      console.log("Starting AI analysis...");
      const analysis = await apiService.analyzeResume(parsed);
      setAiAnalysis(analysis);
      console.log("AI analysis:", analysis);
      
      setAnalysisStep("Generating job recommendations...");
      
      // Step 3: Generate job recommendations
      console.log("Generating job recommendations...");
      const recommendations = await apiService.generateJobRecommendations(
        parsed.skills, 
        parsed.projects
      );
      setJobRecommendations(recommendations);
      console.log("Job recommendations:", recommendations);
      
      // Step 4: Enhance skills semantically
      setAnalysisStep("Enhancing skill analysis...");
      console.log("Enhancing skills...");
      const enhancedSkills = await apiService.enhanceSkillSemantics(parsed.skills);
      setParsedResume(prev => prev ? { ...prev, skills: enhancedSkills } : null);
      console.log("Enhanced skills:", enhancedSkills);
      
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete!",
        description: "Your resume has been analyzed and job recommendations are ready.",
      });
      
    } catch (error) {
      console.error("Analysis error:", error);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    setParsedResume(null);
    setAiAnalysis(null);
    setJobRecommendations([]);
    setAnalysisStep("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-up">
            <div className="flex items-center justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full border border-primary/20">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Smart Resume Analyzer
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and get AI-powered insights, skill analysis, and personalized job recommendations
            </p>
          </div>

          {/* Main Content */}
          {!uploadedFile && !isAnalyzing && !analysisComplete && (
            <div className="animate-scale-in">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          )}

          {isAnalyzing && (
            <div className="animate-scale-in">
              <div className="bg-card border rounded-xl p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Resume</h3>
                <p className="text-muted-foreground mb-2">
                  {analysisStep}
                </p>
                <p className="text-sm text-muted-foreground">
                  This may take a minute as we parse your resume and analyze it with AI...
                </p>
              </div>
            </div>
          )}

          {analysisComplete && parsedResume && aiAnalysis && (
            <div className="animate-fade-up">
              <AnalysisResults 
                fileName={uploadedFile?.name || ""} 
                parsedResume={parsedResume}
                aiAnalysis={aiAnalysis}
                jobRecommendations={jobRecommendations}
                onReset={resetAnalysis} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
