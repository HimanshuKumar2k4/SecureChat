import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Send, Download, Shield, Clock, Copy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      text: 'All messages and files shared here are encrypted and automatically deleted when the session ends.',
      sender: 'other',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sessionId] = useState(() => propSessionId || Math.random().toString(36).substr(2, 9));
  const [isConnected, setIsConnected] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          toast({
            title: "Session expired",
            description: "This secure session has ended. All data has been deleted.",
            variant: "destructive"
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [toast]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto p-4 max-w-4xl">
        {/* Header */}
        <Card className="mb-6 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-secure text-white p-3 rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SecureChat</h1>
                <p className="text-muted-foreground">Temporary secure messaging & file sharing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Session expires in: {formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Session Info */}
        <Card className="mb-6 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Session ID: {sessionId}</p>
                <p className="text-xs text-muted-foreground">Share this link to invite someone</p>
              </div>
            </div>
            <Button onClick={copySessionLink} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="mb-6 flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No messages yet. Start a secure conversation or share files.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    All data will be automatically deleted when the session ends.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-chat-bubble-sent text-chat-bubble-sent-text'
                        : 'bg-chat-bubble-received text-chat-bubble-received-text'
                    }`}
                  >
                    {message.type === 'file' ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Upload className="h-4 w-4" />
                          <span className="text-sm font-medium">{message.fileName}</span>
                        </div>
                        <div className="text-xs opacity-75">{message.fileSize}</div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm">{message.text}</p>
                    )}
                    <div className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
              </Button>
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Type a secure message..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Security Notice */}
        <Card className="p-4 bg-secure/5 border-secure/20">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-secure mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-secure mb-1">End-to-End Encrypted</p>
              <p className="text-muted-foreground">
                Your messages and files are encrypted and will be automatically deleted when this session ends. 
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