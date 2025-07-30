import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatMessage } from "./ChatMessage";
import { Send } from "lucide-react";
import zuzuLogo from "@/assets/zuzu-penguin-logo.png";
import shaazData from "@/components/shaaz_data.json";
import { getClosestShaazReply } from "@/components/embedding";
import { generateZuzuReply } from "@/components/generateZuzuReply"; // ✅ updated

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string; // ✅ add this
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello, gentle soul... I'm Zuzu. Let your heart speak and I shall listen. 🐧💙",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + "user",
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const matchedReply = getClosestShaazReply(inputValue, shaazData);
      const { replyText, imageUrl } = await generateZuzuReply(inputValue, matchedReply);

      const zuzuMessage: Message = {
        id: Date.now().toString() + "zuzu",
        text: replyText,
        isUser: false,
        timestamp: new Date(),
        imageUrl
      };

      setMessages(prev => [...prev, zuzuMessage]);
    } catch (error) {
      console.error("Zuzu error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + "error",
        text: "Oops... Zuzu got a little shy and couldn't reply right now.",
        isUser: false,
        timestamp: new Date()
      }]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4 font-comfy">
      <Card className="mb-6 p-8 text-center bg-gentle-waves/70">
        <div className="flex items-center justify-center gap-3 mb-3">
          <img src={zuzuLogo} alt="Zuzu the gentle penguin" className="w-12 h-12 rounded-full waddle" />
          <h1 className="text-3xl font-bold bg-aurora bg-clip-text text-transparent font-comfy">Zuzu</h1>
          <div className="w-2 h-2 bg-accent rounded-full animate-peaceful-pulse"></div>
        </div>
      </Card>

      <div className="flex-1 overflow-y-auto space-y-1 px-2">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message.text}
            isUser={message.isUser}
            timestamp={message.timestamp}
            imageUrl={message.imageUrl} // ✅ pass imageUrl
          />
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <Card className="p-5 bg-card/70 border-border/60 rounded-3xl">
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground font-quick">Zuzu is waddling with love...</span>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <Card className="mt-4 p-6 bg-gentle-waves/50">
        <div className="flex items-center space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share your heart... 🐧💙"
            className="flex-1"
            disabled={isTyping}
          />
          <Button 
            onClick={handleSendMessage}
            variant="gentle"
            size="lg"
            disabled={isTyping || !inputValue.trim()}
            className="shrink-0 rounded-2xl"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    </div>
  );
};
