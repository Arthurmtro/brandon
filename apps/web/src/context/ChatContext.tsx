"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

type Message = {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    createdAt: Date;
};

interface ChatContextType {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    addMessage: (content: string, role: 'user' | 'assistant') => void;
    clearMessages: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            content: "Bonjour, bienvenue au Grand Hôtel California. Comment puis-je vous aider aujourd'hui ?",
            role: 'assistant',
            createdAt: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addMessage = (content: string, role: 'user' | 'assistant') => {
        const newMessage: Message = {
            id: Date.now().toString(),
            content,
            role,
            createdAt: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                isLoading,
                error,
                addMessage,
                clearMessages,
                setLoading: setIsLoading,
                setError,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
