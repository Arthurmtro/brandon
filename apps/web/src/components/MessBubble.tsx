import React from 'react';
import styles from './MessBubble.module.css';

interface MessBubbleProps {
  message: string;
  isBot: boolean;
}

const MessBubble: React.FC<MessBubbleProps> = ({ message, sender }) => {
  return (
    <div
      className={`${styles.speechBubble} ${sender === 'bot' ? styles.botBubble : styles.userBubble}`}
    >
      {message}
    </div>
  );
};

export default MessBubble;
