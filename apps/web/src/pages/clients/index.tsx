import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChatProvider } from '@/context/ChatContext';
import Chat from '@/components/Chat';

export default function ClientsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    setFadeIn(false); // Déclenche le fade out
    const timer = setTimeout(() => {
      setFadeIn(true); // Déclenche le fade in après un délai
    }, 50);

    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <ChatProvider>
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
          <Chat className='w-full' onLoadingChange={setIsLoading} />
        </div>
      </div>
    </ChatProvider>
  );
}
