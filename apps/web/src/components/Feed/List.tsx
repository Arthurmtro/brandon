import { FC, FormEvent, Fragment, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "../ui/input";
import { FeedItem } from "./Item";
import { useWebSocket } from "@/context/websocket.context";

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

const LoadingDots: FC = () => {
  return (
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
};

export const FeedList: FC<FeedListProps> = ({
  onLoadingChange,
  onSpeaking,
  onFirstQuestionAskedChange,
}) => {
  const { socket } = useWebSocket();

  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  // aiLoading is true until the first payload arrives.
  const [aiLoading, setAiLoading] = useState(false);
  // aiSpeaking is true while the response is streaming.
  const [aiSpeaking, setAiSpeaking] = useState(false);
  // Track if the first question has been asked.
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);

  // Expose aiLoading state to parent if provided.
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(aiLoading);
    }
  }, [aiLoading, onLoadingChange]);

  // Expose aiSpeaking state to parent if provided.
  useEffect(() => {
    if (onSpeaking) {
      onSpeaking(aiSpeaking);
    }
  }, [aiSpeaking, onSpeaking]);

  // Expose hasAskedQuestion state to parent if provided.
  useEffect(() => {
    if (onFirstQuestionAskedChange) {
      onFirstQuestionAskedChange(hasAskedQuestion);
    }
  }, [hasAskedQuestion, onFirstQuestionAskedChange]);

  // Ref to track the end of the messages for smooth scrolling.
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    // Set the first question flag if it hasn't been set.
    if (!hasAskedQuestion) {
      setHasAskedQuestion(true);
    }

    // Start both loading and speaking.
    setAiLoading(true);
    setAiSpeaking(true);

    // Add the user message and immediately add a placeholder AI message.
    setMessages((prev) => [
      ...prev,
      { role: "user", content: prompt },
      { role: "ai", content: "", complete: false },
    ]);
    socket.emit("client:send-chat", { text: prompt });
    setPrompt("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  // Scroll to bottom on new messages.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log("Connected to chat namespace");

      socket.on("server:send-chat", (data) => {
        // Expecting data to include { isFinished, text }
        const { isFinished, text } = data;
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          if (
            lastMessage &&
            lastMessage.role === "ai" &&
            !lastMessage.complete
          ) {
            // If this is the first payload chunk, disable loading.
            if (!lastMessage.content && text) {
              setAiLoading(false);
            }
            const updatedMessage = {
              ...lastMessage,
              content: lastMessage.content + text,
              complete: isFinished,
            };
            // When finished streaming, mark aiSpeaking as false.
            if (isFinished) {
              setAiSpeaking(false);
            }
            return [...prevMessages.slice(0, -1), updatedMessage];
          } else {
            // Fallback: start a new AI message if no placeholder exists.
            if (isFinished) {
              setAiSpeaking(false);
            }
            return [
              ...prevMessages,
              { role: "ai", content: text, complete: isFinished },
            ];
          }
        });
      });
    });

    return () => {
      socket.disconnect();
      socket.offAny();
    };
  }, [socket]);

  return (
    <Card
      className={`shadow-sm flex flex-col w-full ${hasAskedQuestion ? "h-full" : "p-0"} max-h-[80vh] backdrop-blur-xs bg-none`}
    >
      {hasAskedQuestion && (
        <CardContent
          className={`overflow-y-auto flex-grow space-y-2 bg-none ${hasAskedQuestion ? "h-full p-4" : "p-0"}`}
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
            onChange={handleInputChange}
          />
        </form>
      </CardFooter>
    </Card>
  );
};
