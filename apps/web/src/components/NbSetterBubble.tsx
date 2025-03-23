"use client"

import MessBubble from './MessBubble';
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/context/ChatContext"
import { Minus, Plus } from 'lucide-react';

interface NbSetterBubbleProps {
  isUser: boolean;
  className?: string;
}

export function NbSetterBubble({ isUser, className }: NbSetterBubbleProps) {
  const [nombre, setNombre] = React.useState<number>(1);
  const { addMessage, setLoading } = useChat()

  const handleSendNb = async () => {
    const message = `Je veux réserver pour ${nombre}`;

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

  const incrementNombre = () => {
    setNombre(prev => prev + 1);
  };

  const decrementNombre = () => {
    setNombre(prev => prev > 1 ? prev - 1 : 1);
  };

  return (
    <MessBubble
      isUser={isUser}
      className={`flex ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <h3 className="text-sm font-medium text-gray-800">
          Quel nombre serez-vous ?
        </h3>

        <div className="flex flex-row items-center gap-5">
          <Button
            size="icon"
            onClick={decrementNombre}
            disabled={nombre <= 1}
          >
            <Minus />
          </Button>

          <div className="text-center text-2xl font-bold">
            {nombre}
          </div>

          <Button
            size="icon"
            onClick={incrementNombre}
            disabled={nombre >= 10}
          >
            <Plus />
          </Button>
        </div>

        <Button
          onClick={handleSendNb}
          className="w-full mt-2"
        >
          Envoyer
        </Button>
      </div>
    </MessBubble>
  )
}