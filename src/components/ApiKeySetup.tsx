
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Eye, EyeOff, CheckCircle } from "lucide-react";

interface ApiKeySetupProps {
  onKeysConfigured: () => void;
}

export const ApiKeySetup = ({ onKeysConfigured }: ApiKeySetupProps) => {
  const [keys, setKeys] = useState({
    openai: '',
    cohere: '',
    affinda: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    cohere: false,
    affinda: false
  });
  const [savedKeys, setSavedKeys] = useState({
    openai: false,
    cohere: false,
    affinda: false
  });

  useEffect(() => {
    // Check if keys are already saved
    const saved = {
      openai: !!localStorage.getItem('openai_api_key'),
      cohere: !!localStorage.getItem('cohere_api_key'),
      affinda: !!localStorage.getItem('affinda_api_key')
    };
    setSavedKeys(saved);
    
    // If at least OpenAI and one parsing service is configured, allow proceeding
    if (saved.openai && (saved.affinda || saved.cohere)) {
      onKeysConfigured();
    }
  }, [onKeysConfigured]);

  const handleSaveKey = (service: keyof typeof keys) => {
    if (keys[service].trim()) {
      localStorage.setItem(`${service}_api_key`, keys[service].trim());
      setSavedKeys(prev => ({ ...prev, [service]: true }));
      setKeys(prev => ({ ...prev, [service]: '' }));
    }
  };

  const toggleVisibility = (service: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [service]: !prev[service] }));
  };

  const canProceed = savedKeys.openai && (savedKeys.affinda || savedKeys.cohere);

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center">
          <Key className="w-8 h-8 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-semibold mb-2">API Configuration</h2>
          <p className="text-muted-foreground">
            Configure your API keys to enable AI-powered resume analysis
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Your API keys are stored locally in your browser and never sent to our servers. 
            You need at least OpenAI and one resume parsing service (Affinda recommended).
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {/* OpenAI Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="openai">OpenAI API Key (Required)</Label>
              {savedKeys.openai && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="openai"
                  type={showKeys.openai ? "text" : "password"}
                  placeholder="sk-..."
                  value={keys.openai}
                  onChange={(e) => setKeys(prev => ({ ...prev, openai: e.target.value }))}
                  disabled={savedKeys.openai}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleVisibility('openai')}
                >
                  {showKeys.openai ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
              <Button 
                onClick={() => handleSaveKey('openai')}
                disabled={!keys.openai.trim() || savedKeys.openai}
                size="sm"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Used for AI resume analysis. Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a>
            </p>
          </div>

          {/* Affinda Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="affinda">Affinda API Key (Recommended)</Label>
              {savedKeys.affinda && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="affinda"
                  type={showKeys.affinda ? "text" : "password"}
                  placeholder="Enter Affinda API key..."
                  value={keys.affinda}
                  onChange={(e) => setKeys(prev => ({ ...prev, affinda: e.target.value }))}
                  disabled={savedKeys.affinda}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleVisibility('affinda')}
                >
                  {showKeys.affinda ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
              <Button 
                onClick={() => handleSaveKey('affinda')}
                disabled={!keys.affinda.trim() || savedKeys.affinda}
                size="sm"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For resume parsing. Get your key from <a href="https://app.affinda.com/api-keys/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Affinda Dashboard</a>
            </p>
          </div>

          {/* Cohere Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cohere">Cohere API Key (Optional)</Label>
              {savedKeys.cohere && <CheckCircle className="w-4 h-4 text-green-500" />}
            </div>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  id="cohere"
                  type={showKeys.cohere ? "text" : "password"}
                  placeholder="Enter Cohere API key..."
                  value={keys.cohere}
                  onChange={(e) => setKeys(prev => ({ ...prev, cohere: e.target.value }))}
                  disabled={savedKeys.cohere}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => toggleVisibility('cohere')}
                >
                  {showKeys.cohere ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </Button>
              </div>
              <Button 
                onClick={() => handleSaveKey('cohere')}
                disabled={!keys.cohere.trim() || savedKeys.cohere}
                size="sm"
              >
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For enhanced job recommendations and skill analysis. Get your key from <a href="https://dashboard.cohere.ai/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Cohere Dashboard</a>
            </p>
          </div>
        </div>

        {canProceed && (
          <div className="text-center pt-4 border-t">
            <Button onClick={onKeysConfigured} className="px-8">
              Start Analyzing Resumes
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
