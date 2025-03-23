'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import MessBubble from '@/components/MessBubble';
import { CalendarBubble } from '@/components/CalendarBubble';
import { PencilLine } from 'lucide-react';
import { NbSetterBubble } from './NbSetterBubble';
import { useWebSocket } from '@/context/websocket.context';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
}

interface ChatProps {
  className?: string;
  onLoadingChange?: (loading: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({ className, onLoadingChange }) => {
  const { socket } = useWebSocket();
  const { messages, isLoading, addMessage, setLoading, setError } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [fadeIn, setFadeIn] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    addMessage(input, 'user');

    const messageToSend = input;
    setInput('');

    setLoading(true);
    onLoadingChange?.(true);

    try {
      // const response = await fetch('http://localhost:3010/api/chat', {
      //     method: 'POST',
      //     headers: {
      //         'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({ message: messageToSend }),
      // });

      // if (!response.ok) {
      //     throw new Error('Erreur lors de la communication avec le serveur');
      // }
      socket.emit('client:send-chat', { text: messageToSend });
      socket.on('server:send-chat', (data: any) => {
        addMessage(data.text, 'assistant');
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className='h-140 overflow-y-auto mb-4 p-2 space-y-2'>
        {messages.map((msg) => {
          const isCalendarCommand =
            msg.role === 'assistant' && msg.content === 'command : set-date';
          const isNbCommand =
            msg.role === 'assistant' && msg.content === 'command : set-nb';
          const isWeatherCommand =
            msg.role === 'assistant' && msg.content === 'command : dsp-weather';

          if (isCalendarCommand) {
            return (
              <CalendarBubble
                key={msg.id}
                isUser={false}
                className='bg-blue-600 justify-start'
              />
            );
          }

          if (isNbCommand) {
            return (
              <NbSetterBubble
                key={msg.id}
                isUser={false}
                className='bg-amber-600 justify-end'
              />
            );
          }

          if (isWeatherCommand) {
            return (
              <WeatherBubble
                key={msg.id}
                isUser={false}
                className='bg-amber-600 justify-end'
                data={msg.content}
              />
            );
          }

          return (
            <MessBubble
              key={msg.id}
              isUser={msg.role === 'user'}
              className={`flex ${msg.role === 'assistant' ? 'bg-blue-600 justify-start' : 'bg-amber-600 justify-end'}`}
            >
              {msg.content}
            </MessBubble>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

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
          disabled={isLoading || !input.trim()}
          className='p-2 bg-amber-200 text-black rounded-r-lg hover:bg-amber-500'
        >
          <PencilLine />
        </button>
      </form>
    </div>
  );
};

export default Chat;
