import React from 'react';
import { cn } from '@/utils/cn'; // Make sure you have this utility from shadcn

interface MessBubbleProps {
  children: React.ReactNode;
  className?: string;
  isUser: boolean; // Differentiates between user and bot messages
}

const MessBubble: React.FC<MessBubbleProps> = ({
  children,
  className,
  isUser,
}) => {
  return (
    <div
      className={cn(
        'relative my-2 p-4 w-fit max-w-[70%] rounded text-left',
        isUser
          ? 'bg-blue-500 text-white self-end ml-auto'
          : 'bg-[#f4fbfe] text-black self-start mr-auto',
        className
      )}
    >
      {children}
    </div>
  );
};

export default MessBubble;
