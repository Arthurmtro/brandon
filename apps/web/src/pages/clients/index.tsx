import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useState } from 'react';
import { FaPenFancy } from 'react-icons/fa';
import { useWebSocket } from '@/context/websocket.context';
import MessBubble from '@/components/MessBubble';

// Définir des types pour les messages
interface Message {
  id?: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export default function ClientsPage() {
  const { isConnected, socket } = useWebSocket();

  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Bonjour, bienvenue au Grand Hôtel California. Comment puis-je vous aider aujourd'hui ?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [fadeIn, setFadeIn] = useState(true);

  // Fonction pour faire défiler automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Effet pour le défilement automatique lorsque de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setFadeIn(false); // Déclenche le fade out
    const timer = setTimeout(() => {
      setFadeIn(true); // Déclenche le fade in après un délai
    }, 50);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const addMessage = (text: string, sender: 'bot' | 'user') => {
    const newMessage: Message = {
      text,
      sender,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
  };

  // Gérer l'envoi d'un message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !isConnected) return;

    // Ajouter le message de l'utilisateur à l'interface
    addMessage(input, 'user');

    // Stocker le message à envoyer puis vider l'input
    const messageToSend = input;
    setInput('');

    // Montrer que le bot est en train de "taper"
    setIsLoading(true);

    try {
      // Envoyer les messages au serveur via WebSocket
      socket.emit('send-chat', { messages });

      // Note: La réponse sera gérée par l'écouteur d'événements "server:message"
      // configuré dans useEffect
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");

      // Arrêter l'indicateur de chargement en cas d'erreur
      setIsLoading(false);
    }
  };

  return (
    <div
      className='h-screen bg-cover bg-center'
      style={{ backgroundImage: "url('images/hotel-lobby.webp')" }}
    >
      {/* Image du réceptionniste */}
      <div className='absolute left-1/6 top-3/5 transform -translate-y-1/2'>
        <div
          className={`transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={
              isLoading
                ? '/images/receptionist_thinking.webp'
                : '/images/receptionist_welcomed.webp'
            }
            width={300}
            height={300}
            alt='Receptionist'
          />
        </div>
      </div>

      {/* Fenêtre de chat */}
      <div className='absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-lg'>
        <div className='h-120 overflow-y-auto mb-4 p-2'>
          {messages.map((msg, index) => (
            <MessBubble
              key={index}
              className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-lg text-white opacity-80 ${
                  index % 2 === 0 ? 'bg-blue-600' : 'bg-amber-600'
                }`}
                style={{ fontFamily: 'Press Start 2P, cursive' }}
              >
                {msg.text}
              </div>
            </MessBubble>
          ))}
          {/* Référence pour le défilement automatique */}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <form onSubmit={handleSendMessage} className='flex'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Tapez un message...'
            className='w-full p-2 bg-gray-100 border-2 border-gray-300 rounded-l-lg text-black'
          />
          <button
            type='submit'
            disabled={!isConnected || isLoading || !input.trim()}
            className='p-2 bg-amber-200 text-black rounded-r-lg hover:bg-amber-500'
          >
            <FaPenFancy />
          </button>
        </form>
      </div>
    </div>
  );
}
