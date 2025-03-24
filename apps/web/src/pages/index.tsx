import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { FeedList } from "@/components/Feed/List";
import { ChatProvider } from "@/context/ChatContext";
import { Card, CardContent } from "@/components/ui/card";
import { FeedFetchList } from "@/components/Feed/List-fetch";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstQuestionAsked, setFirstQuestionAsked] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <ChatProvider>
      <div
        className="h-screen bg-cover bg-center w-full"
        style={{
          backgroundImage: "url('images/hotel-lobby.webp')",
        }}
      >
        {/* Floating button at top right */}
        <Button className="fixed top-0 right-0 m-4 z-10" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>

        <div className="h-screen backdrop-blur-xs">
          <div className="flex items-center justify-between h-screen px-5">
            <div className="flex-1/2">
              <Image
                src={
                  isLoading
                    ? "/images/receptionist_thinking.webp"
                    : isSpeaking
                      ? "/images/receptionist_speaking.webp"
                      : "/images/receptionist_welcomed.webp"
                }
                alt="Chat assistant"
                width={500}
                height={500}
              />
            </div>
            <div className=" flex flex-col w-full h-full max-h-[80vh] align-center justify-center space-y-10">
              {!firstQuestionAsked && (
                <Card
                  className={`max-w-[80%] bg-blue-500 text-white shadow-md p-0 border-none text-center mx-auto`}
                >
                  <CardContent className="p-3 flex flex-col items-center justify-center space-y-2">
                    <h1 className="text-4xl font-bold text-center text-white">
                      Welcome to the{" "}
                      <b className=" text-blue-800">Hotel California!</b>
                    </h1>
                    {/* <p className="text-lg whitespace-pre-wrap break-words"> */}
                    <p className="text-lg text-center text-white">
                      Ask me anything about the hotel.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* <FeedList
                onFirstQuestionAskedChange={(asked) =>
                  setFirstQuestionAsked(asked)
                }
                onSpeaking={setIsSpeaking}
                onLoadingChange={setIsLoading}
              /> */}

              <FeedFetchList
                onFirstQuestionAskedChange={(asked) =>
                  setFirstQuestionAsked(asked)
                }
                onSpeaking={setIsSpeaking}
                onLoadingChange={setIsLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default HomePage;
