
import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Header } from "@/components/Header";
import { Brain } from "lucide-react";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsAnalyzing(true);
    
    // Simulate analysis process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  const resetAnalysis = () => {
    setUploadedFile(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
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
                <p className="text-muted-foreground">
                  Our AI is processing your resume and generating insights...
                </p>
              </div>
            </div>
          )}

          {analysisComplete && (
            <div className="animate-fade-up">
              <AnalysisResults fileName={uploadedFile?.name || ""} onReset={resetAnalysis} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
