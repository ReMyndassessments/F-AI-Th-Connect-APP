import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, ArrowLeft, Key, Info } from 'lucide-react';
import { Link } from 'wouter';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  details?: string;
}

export default function APIDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    const tests = [
      {
        name: 'API Key Check',
        test: async (): Promise<DiagnosticResult> => {
          try {
            const response = await fetch('/api/tts/voices');
            const data = await response.json();
            
            if (response.ok && data.available) {
              return {
                test: 'API Key Check',
                status: 'success',
                message: 'ElevenLabs API key is present and functional',
                details: `Found ${data.voices?.length || 0} voices`
              };
            } else {
              return {
                test: 'API Key Check',
                status: 'error',
                message: 'API key issue detected',
                details: data.message || 'Unknown error'
              };
            }
          } catch (error) {
            return {
              test: 'API Key Check',
              status: 'error',
              message: 'Failed to check API key',
              details: error instanceof Error ? error.message : 'Network error'
            };
          }
        }
      },
      {
        name: 'Voice Generation Test',
        test: async (): Promise<DiagnosticResult> => {
          try {
            const response = await fetch('/api/tts/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: 'Test',
                voiceId: 'EXAVITQu4vr4xnSDxMaL'
              })
            });

            if (response.ok) {
              return {
                test: 'Voice Generation Test',
                status: 'success',
                message: 'Voice generation is working',
                details: 'Successfully generated test audio'
              };
            } else {
              const errorData = await response.json();
              return {
                test: 'Voice Generation Test',
                status: 'error',
                message: 'Voice generation failed',
                details: errorData.message || `HTTP ${response.status}`
              };
            }
          } catch (error) {
            return {
              test: 'Voice Generation Test',
              status: 'error',
              message: 'Failed to test voice generation',
              details: error instanceof Error ? error.message : 'Network error'
            };
          }
        }
      }
    ];

    for (const { name, test } of tests) {
      // Add pending state
      setDiagnostics(prev => [...prev, {
        test: name,
        status: 'pending',
        message: 'Running...',
      }]);

      const result = await test();
      
      // Update with result
      setDiagnostics(prev => 
        prev.map(d => d.test === name ? result : d)
      );

      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ElevenLabs API Diagnostics</h1>
            <p className="text-gray-600">Test and troubleshoot your ElevenLabs integration</p>
          </div>
          <Link href="/voice-test">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Voice Test</span>
            </Button>
          </Link>
        </div>

        {/* Run Diagnostics Button */}
        <div className="mb-6">
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Key className="w-4 h-4" />
            )}
            <span>{isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}</span>
          </Button>
        </div>

        {/* Diagnostic Results */}
        <div className="space-y-4 mb-8">
          {diagnostics.map((result, index) => (
            <Card key={index} className={`border ${getStatusColor(result.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{result.test}</h3>
                      <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                        {result.status}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-1">{result.message}</p>
                    {result.details && (
                      <p className="text-sm text-gray-500 italic">{result.details}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Common Issues and Solutions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Common Issues and Solutions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-2">401 Unauthorized Errors</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Check if your API key is valid and active</li>
                  <li>• Ensure the API key has "voices_read" and "tts_generation" permissions</li>
                  <li>• Verify the API key format starts with "sk-" and is exactly 32 characters</li>
                  <li>• Try regenerating your API key in the ElevenLabs dashboard</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-600 mb-2">API Key Setup</h4>
                <ol className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>1. Visit <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">elevenlabs.io</a></li>
                  <li>2. Create a free account or sign in</li>
                  <li>3. Go to your Profile → API Keys</li>
                  <li>4. Create a new API key with full permissions</li>
                  <li>5. Copy the key and add it to your Replit Secrets</li>
                </ol>
              </div>

              <div>
                <h4 className="font-semibold text-green-600 mb-2">Free Tier Limits</h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• 10,000 characters per month</li>
                  <li>• Access to all voices</li>
                  <li>• No commercial usage restrictions for personal projects</li>
                  <li>• Characters reset monthly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}