"use client"

import MessBubble from './MessBubble';
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { useChat } from "@/context/ChatContext"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface CalendarBubbleProps {
  isUser: boolean;
  className?: string;
}

export function CalendarBubble({ isUser, className }: CalendarBubbleProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const { addMessage, setLoading } = useChat()

  const handleSendDate = async () => {
    if (!date) return;

    const formattedDate = format(date, "dd/MM/yyyy", { locale: fr });

    const message = `Je veux déplacer ma réservation au ${formattedDate}`;

    addMessage(message, 'user');

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      addMessage(data.message, 'assistant');
    } catch (error) {
      console.error("Error sending date:", error);
      addMessage("Désolé, une erreur s'est produite lors de l'envoi de votre demande.", 'assistant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MessBubble
      isUser={isUser}
      className={`flex ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-medium text-gray-800">
          Quelle nouvelle date voulez-vous ?
        </h3>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border bg-white"
        />

        <Button
          onClick={handleSendDate}
          className="w-full mt-2"
        >
          Envoyer
        </Button>
      </div>
    </MessBubble>
  )
}