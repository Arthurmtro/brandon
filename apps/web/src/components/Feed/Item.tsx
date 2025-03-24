import { FC } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  readonly message: { content: string; role: string };
}

export const FeedItem: FC<Props> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`pb-2 flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-[80%] ${isUser ? "bg-white text-gray-800" : "bg-blue-500 text-white"} shadow-md p-0`}
      >
        <CardContent className="p-3">
          <p className="whitespace-pre-wrap break-words">
            {typeof message.content === "string"
              ? message.content
              : JSON.stringify(message.content)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
