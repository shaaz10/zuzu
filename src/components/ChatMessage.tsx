interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  imageUrl?: string;
}

export const ChatMessage = ({ message, isUser, timestamp, imageUrl }: ChatMessageProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div className={`rounded-2xl p-4 max-w-sm ${isUser ? "bg-primary text-white" : "bg-muted/40 text-foreground"}`}>
        <p>{message}</p>
        {imageUrl && !isUser && (
          <img src={imageUrl} alt="Penguin Reaction" className="mt-2 w-28 rounded-xl" />
        )}
        <div className="text-xs text-muted-foreground mt-1">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
