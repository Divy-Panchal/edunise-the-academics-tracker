import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Send, Users, HelpCircle, BookOpen, Hash } from "lucide-react";

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: string;
  subject?: string;
}

interface ChatChannel {
  id: string;
  name: string;
  subject: string;
  memberCount: number;
  unreadCount: number;
}

const CommunityChat = () => {
  const [channels] = useState<ChatChannel[]>([
    { id: "1", name: "general", subject: "General", memberCount: 150, unreadCount: 3 },
    { id: "2", name: "dsa-help", subject: "DSA", memberCount: 85, unreadCount: 7 },
    { id: "3", name: "dbms-doubts", subject: "DBMS", memberCount: 62, unreadCount: 0 },
    { id: "4", name: "web-dev", subject: "Web Tech", memberCount: 98, unreadCount: 2 }
  ]);

  const [messages] = useState<ChatMessage[]>([
    {
      id: "1",
      user: "Alex",
      avatar: "A",
      message: "Can someone help me with binary tree traversal?",
      timestamp: "2 min ago",
      subject: "DSA"
    },
    {
      id: "2",
      user: "Sarah",
      avatar: "S",
      message: "Sure! Are you looking for inorder, preorder, or postorder?",
      timestamp: "1 min ago"
    },
    {
      id: "3",
      user: "Mike",
      avatar: "M",
      message: "I have a great resource for tree algorithms. Let me share it.",
      timestamp: "30s ago"
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [activeChannel, setActiveChannel] = useState("dsa-help");

  const sendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the server
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const getChannelIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case "dsa":
        return <HelpCircle className="w-4 h-4" />;
      case "dbms":
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <Card className="h-full shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-primary" />
          Community Chat
        </CardTitle>
        
        {/* Channel List */}
        <div className="space-y-1 mt-3">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel.name)}
              className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-smooth ${
                activeChannel === channel.name
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-2">
                {getChannelIcon(channel.subject)}
                <span className="text-sm font-medium">#{channel.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {channel.memberCount}
                </Badge>
              </div>
              {channel.unreadCount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-xs">
                  {channel.unreadCount}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-[300px]">
        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto mb-3">
          {messages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs bg-gradient-primary text-white">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{message.user}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  {message.subject && (
                    <Badge variant="secondary" className="text-xs">
                      {message.subject}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground">{message.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <Input
            placeholder={`Message #${activeChannel}...`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1"
          />
          <Button onClick={sendMessage} size="sm" className="gap-2">
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Online Members */}
        <div className="flex items-center gap-1 mt-2">
          <Users className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {channels.find(c => c.name === activeChannel)?.memberCount} members online
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityChat;