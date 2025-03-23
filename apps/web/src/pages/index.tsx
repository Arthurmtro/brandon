import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const HomePage = () => {
  const [prompt, setPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrompt(value);
    setIsTyping(value.length > 0);
  };

  return (
    <div
      className='h-screen bg-cover bg-center w-full'
      style={{
        backgroundImage: "url('images/hotel-lobby.webp')",
      }}
    >
      {/* floating button o top right  */}
      <Button className='fixed top-0 right-0 m-4' asChild>
        <Link href='/dashboard'>Dashboard</Link>
      </Button>

      <div className='flex flex-col items-center justify-center h-screen p-4 bg-gray-50'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <img
            src='/images/receptionist_welcomed.webp'
            alt='Chat assistant'
            className='rounded-full shadow-md w-40 h-40'
          />
          <Card className='shadow-sm'>
            <CardContent className='p-4'>
              <p className='text-center text-lg font-medium'>
                What can I do for you?
              </p>
            </CardContent>
          </Card>
        </div>

        {/* <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className='fixed bottom-0 left-0 w-full bg-white shadow-lg py-2 px-4 flex items-center justify-between gap-2'
            >
              <span className='text-gray-700 font-medium'>
                Prompt Mode Activated
              </span>
              <Button variant='outline'>Cancel</Button>
            </motion.div>
          )}
        </AnimatePresence> */}

        <div className='fixed bottom-0 w-full px-4 pb-4'>
          <Input
            type='text'
            placeholder='Type your message...'
            className='shadow'
            value={prompt}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
