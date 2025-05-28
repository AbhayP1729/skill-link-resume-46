
import { Brain, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Resume Analyzer</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </Button>
        </div>
      </div>
    </header>
  );
};
