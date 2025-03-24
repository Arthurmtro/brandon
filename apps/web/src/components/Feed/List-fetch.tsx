import { FC, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "../ui/input";
import { FeedItem } from "./Item";
import { api } from "@repo/client";

interface Message {
  role: string;
  content: string;
  complete?: boolean;
}

interface FeedListProps {
  onLoadingChange?: (loading: boolean) => void;
  onSpeaking?: (speaking: boolean) => void;
  onFirstQuestionAskedChange?: (asked: boolean) => void;
}

const LoadingDots: FC = () => (
  <div className="flex space-x-1">
    <span
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    ></span>
    <span
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></span>
    <span
      className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
      style={{ animationDelay: "0.4s" }}
    ></span>
  </div>
);

export const FeedFetchList: FC<FeedListProps> = ({
  onLoadingChange,
  onSpeaking,
  onFirstQuestionAskedChange,
}) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onLoadingChange?.(aiLoading);
  }, [aiLoading]);

  useEffect(() => {
    onSpeaking?.(aiSpeaking);
  }, [aiSpeaking]);

  useEffect(() => {
    onFirstQuestionAskedChange?.(hasAskedQuestion);
  }, [hasAskedQuestion]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    if (!hasAskedQuestion) {
      setHasAskedQuestion(true);
    }

    setAiLoading(true);
    setAiSpeaking(true);

    const userMessage: Message = { role: "user", content: prompt };
    const aiPlaceholder: Message = { role: "ai", content: "", complete: false };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    setPrompt("");

    try {
      // const response = await fetch("/api/chat", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // });

      const response = await api.agents.agentControllerSendMEssage({
        clientId: "1",
        input: prompt,
      });

      const data = response.data;

      const aiResponse: Message = {
        role: "ai",
        content: data || "Sorry, no response.",
        complete: true,
      };

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = aiResponse;
        return updated;
      });
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "ai",
          content: "An error occurred. Please try again.",
          complete: true,
        };
        return updated;
      });
    } finally {
      setAiLoading(false);
      setAiSpeaking(false);
    }
  };

  return (
    <Card
      className={`shadow-sm flex flex-col w-full ${hasAskedQuestion ? "h-full" : "p-0"} max-h-[80vh]`}
    >
      {hasAskedQuestion && (
        <CardContent
          className={`overflow-y-auto flex-grow space-y-2 ${hasAskedQuestion ? "h-full p-4" : "p-0"}`}
        >
          {messages.map((message, index) => (
            <Fragment key={index}>
              {message.role === "ai" &&
              !message.complete &&
              message.content === "" ? (
                <LoadingDots />
              ) : (
                <FeedItem message={message} />
              )}
            </Fragment>
          ))}
          <div ref={bottomRef} />
        </CardContent>
      )}
      <CardFooter className={`${hasAskedQuestion ? "border-t px-4" : "p-0"}`}>
        <form onSubmit={handleSendMessage} className="w-full">
          <Input
            type="text"
            placeholder="Type your message..."
            className="shadow"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </form>
      </CardFooter>
    </Card>
  );
};
