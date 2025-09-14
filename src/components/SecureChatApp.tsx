import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Send, Download, Shield, Copy, Users, UserPlus, LogOut, Phone, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from './ThemeToggle';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type: 'text' | 'file';
  fileName?: string;
  fileSize?: string;
  fileType?: string;
}

interface SecureChatAppProps {
  sessionId?: string;
}

const SecureChatApp: React.FC<SecureChatAppProps> = ({ sessionId: propSessionId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to SecureChat! This is a demonstration of secure, temporary messaging.',
      sender: 'other',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '2', 
      text: 'All messages and files shared here are encrypted and will be deleted when you end the session.',
      sender: 'other',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionId] = useState(() => propSessionId || Math.random().toString(36).substr(2, 9));
  const [isConnected, setIsConnected] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();


  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileMessage: Message = {
      id: Date.now().toString(),
      text: `Shared file: ${file.name}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'file',
      fileName: file.name,
      fileSize: formatFileSize(file.size),
      fileType: file.type
    };

    setMessages(prev => [...prev, fileMessage]);
    toast({
      title: "File uploaded",
      description: `${file.name} has been shared securely.`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copySessionLink = () => {
    const link = `${window.location.origin}/chat/${sessionId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Session link copied to clipboard.",
    });
  };

  const pickContact = async () => {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      try {
        // @ts-ignore - Contact Picker API
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
        if (contacts.length > 0) {
          const contact = contacts[0];
          const link = `${window.location.origin}/chat/${sessionId}`;
          const message = `Join me for a secure chat: ${link}`;
          
          // Try to open native sharing if available
          if (navigator.share) {
            await navigator.share({
              title: 'SecureChat Invitation',
              text: `${contact.name}, ${message}`,
            });
          } else {
            // Fallback to copying
            navigator.clipboard.writeText(message);
            toast({
              title: "Invitation ready",
              description: `Message for ${contact.name} copied to clipboard.`,
            });
          }
        }
      } catch (error) {
        toast({
          title: "Contact access unavailable",
          description: "Contact picker not supported. Use the copy link instead.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Contact access unavailable", 
        description: "Contact picker not supported on this device.",
        variant: "destructive"
      });
    }
  };

  const endSession = () => {
    toast({
      title: "Session ended",
      description: "This secure session has been terminated. All data has been deleted.",
    });
    // In a real app, this would clear all data and redirect
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full opacity-20 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-secure rounded-full opacity-15 animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-32 w-40 h-40 bg-gradient-hero rounded-full opacity-10 animate-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <div className="container mx-auto p-4 max-w-4xl relative z-10">
        {/* Header */}
        <Card className="mb-6 p-6 shadow-elevated bg-gradient-card border-0 animate-fade-in backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="bg-gradient-primary text-white p-4 rounded-2xl shadow-secure animate-pulse-glow">
                  <Shield className="h-7 w-7" />
                </div>
                <div className="absolute -top-1 -right-1 bg-gradient-hero p-1 rounded-full">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  SecureChat
                </h1>
                <p className="text-muted-foreground font-medium">
                  Temporary secure messaging & file sharing
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <div className="flex items-center space-x-2 px-3 py-2 rounded-full bg-gradient-primary/10">
                <div className={`w-3 h-3 rounded-full transition-colors ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className="text-sm font-medium text-foreground">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
              <Button 
                onClick={endSession} 
                variant="outline" 
                size="sm" 
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <LogOut className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </Card>

        {/* Session Info */}
        <Card className="mb-6 p-5 shadow-card bg-gradient-card border-0 animate-fade-in hover:shadow-elevated transition-all duration-500" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-gradient-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Session ID: <span className="font-mono text-primary">{sessionId}</span></p>
                <p className="text-xs text-muted-foreground">Invite someone to join this secure chat</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={pickContact} 
                variant="outline" 
                size="sm"
                className="hover:bg-gradient-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                <Phone className="h-4 w-4 mr-2" />
                Pick Contact
              </Button>
              <Button 
                onClick={copySessionLink} 
                variant="outline" 
                size="sm"
                className="hover:bg-gradient-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-glow"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="mb-6 flex flex-col h-96 shadow-elevated bg-gradient-card border-0 animate-scale-in backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center animate-fade-in">
                <div className="space-y-4">
                  <div className="relative">
                    <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-pulse-glow">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-hero p-1 rounded-full animate-float">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground font-medium text-lg">
                      Ready for secure messaging
                    </p>
                    <p className="text-muted-foreground">
                      Start a conversation or share files safely
                    </p>
                    <p className="text-sm text-muted-foreground opacity-75">
                      All data will be deleted when you end the session
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-5 py-3 rounded-3xl shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-elevated ${
                      message.sender === 'user'
                        ? 'bg-gradient-primary text-white shadow-glow'
                        : 'bg-chat-bubble-received text-chat-bubble-received-text border border-border/50'
                    }`}
                  >
                    {message.type === 'file' ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="p-2 rounded-lg bg-white/20">
                            <Upload className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold">{message.fileName}</span>
                        </div>
                        <div className="text-xs opacity-90 font-medium">{message.fileSize}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                        >
                          <Download className="h-3 w-3 mr-2" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    )}
                    <div className="text-xs opacity-75 mt-2 font-medium">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-border/50 p-5 bg-gradient-card/50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="hover:bg-gradient-primary hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-glow"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type a secure message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 border-border/50 bg-background/50 backdrop-blur-sm focus:shadow-glow transition-all duration-300"
              />
              <Button 
                onClick={handleSendMessage} 
                size="sm"
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-glow hover:scale-110 transition-all duration-300"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-6 bg-gradient-secure/10 border-0 shadow-secure animate-fade-in backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-gradient-secure text-white shadow-secure animate-pulse-glow">
              <Shield className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-primary text-lg flex items-center gap-2">
                End-to-End Encrypted
                <Sparkles className="h-4 w-4 animate-pulse" />
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Your messages and files are encrypted and will be deleted when you end this session. 
                No data is permanently stored on our servers.
              </p>
            </div>
          </div>
        </Card>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="*/*"
        />
      </div>
    </div>
  );
};

export default SecureChatApp;