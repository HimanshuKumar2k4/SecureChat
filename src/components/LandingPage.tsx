import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Shield, MessageCircle, Upload, Clock, Zap, Lock, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import secureIcon from '@/assets/secure-chat-icon.png';

const LandingPage = () => {
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const createNewSession = () => {
    const newSessionId = Math.random().toString(36).substr(2, 9);
    navigate(`/chat/${newSessionId}`);
    toast({
      title: "Session created",
      description: "Your secure chat session is ready!",
    });
  };

  const joinSession = () => {
    if (!sessionId.trim()) {
      toast({
        title: "Session ID required",
        description: "Please enter a valid session ID to join.",
        variant: "destructive"
      });
      return;
    }
    navigate(`/chat/${sessionId.trim()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-secure/10 backdrop-blur-sm">
              <img src={secureIcon} alt="SecureChat" className="h-16 w-16" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-secure to-accent bg-clip-text text-transparent">
            SecureChat
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Temporary, secure messaging and file sharing with end-to-end encryption. 
            No registration required, no permanent storage.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={createNewSession}
              size="lg"
              className="bg-secure hover:bg-secure-dark text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start New Session
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Enter session ID..."
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-48"
                onKeyPress={(e) => e.key === 'Enter' && joinSession()}
              />
              <Button 
                onClick={joinSession}
                variant="outline"
                size="lg"
              >
                Join Session
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-secure/10">
                <Lock className="h-6 w-6 text-secure" />
              </div>
              <h3 className="text-lg font-semibold">End-to-End Encrypted</h3>
            </div>
            <p className="text-muted-foreground">
              Military-grade encryption ensures your messages and files are secure from end to end.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Temporary by Design</h3>
            </div>
            <p className="text-muted-foreground">
              All data automatically deletes when your session ends. No permanent storage, ever.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">No Registration</h3>
            </div>
            <p className="text-muted-foreground">
              Start chatting immediately. No accounts, passwords, or personal information required.
            </p>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Secure Communication Made Simple</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-6 w-6 text-secure mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Real-time Messaging</h4>
                  <p className="text-muted-foreground">Instant, encrypted messaging with typing indicators and read receipts.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Upload className="h-6 w-6 text-accent mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Secure File Sharing</h4>
                  <p className="text-muted-foreground">Share images, videos, documents, and any file type securely.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Easy Sharing</h4>
                  <p className="text-muted-foreground">Simple session links make it easy to invite others to your secure chat.</p>
                </div>
              </div>
            </div>
          </div>
          
          <Card className="p-8 bg-secure/5 border-secure/20">
            <div className="text-center">
              <Shield className="h-16 w-16 text-secure mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-4">Privacy First</h3>
              <p className="text-muted-foreground mb-6">
                Your conversations are private by design. We can't see your messages even if we wanted to.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-secure">0</div>
                  <div className="text-muted-foreground">Data Stored</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-secure">Conversation Time</div>
                  <div className="text-muted-foreground">Max Session</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="p-6 bg-destructive/5 border-destructive/20 text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Shield className="h-5 w-5 text-destructive" />
            <span className="font-semibold text-destructive">Security Notice</span>
          </div>
          <p className="text-muted-foreground text-sm">
            While SecureChat provides strong encryption, always exercise caution when sharing sensitive information online. 
            This service is intended for temporary, secure communication needs.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;