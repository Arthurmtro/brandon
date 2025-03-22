import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { FaPenFancy } from "react-icons/fa";
import { api, socketApi } from "@repo/client";

// Définir des types pour les messages
interface Message {
  id?: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

export default function ClientsPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Bonjour, bienvenue au Grand Hôtel California. Comment puis-je vous aider aujourd'hui ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef(socketApi.chat.socket);

  // Fonction pour faire défiler automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effet pour le défilement automatique lorsque de nouveaux messages arrivent
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effet pour initialiser la connexion WebSocket
  useEffect(() => {
    // Établir la connexion WebSocket
    const initializeSocket = async () => {
      try {
        setIsLoading(true);

        // Connecter le socket
        // socketRef.current = socketApi.chat.socket.connect();
        socketRef.current.connect();

        // Écouter les événements du socket
        socketRef.current.on("connect", () => {
          setIsConnected(true);
          setError(null);
          console.log("Socket connecté");
        });

        socketRef.current.on("disconnect", () => {
          setIsConnected(false);
          console.log("Socket déconnecté");
        });

        socketRef.current.on("connect_error", (err: Error) => {
          setError(`Erreur de connexion: ${err.message}`);
          setIsConnected(false);
        });

        // Écouter les réponses du chatbot
        // socket.on("server:message", (data: { message: string }) => {
        //   addMessage(data.message, "bot");
        // });

        // Ping-pong pour vérifier la connexion
        socketRef.current.emit("client:ping");
        socketRef.current.on("server:pong", () => {
          console.log("Pong reçu du serveur");
        });
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setError("Impossible de se connecter au serveur de chat");
      } finally {
        setIsLoading(false);
      }
    };

    initializeSocket();

    // Nettoyer la connexion lors du démontage du composant
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Fonction pour ajouter un message à la liste
  const addMessage = (text: string, sender: "bot" | "user") => {
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
    addMessage(input, "user");

    // Stocker le message à envoyer puis vider l'input
    const messageToSend = input;
    setInput("");

    // Montrer que le bot est en train de "taper"
    setIsLoading(true);

    try {
      // Envoyer le message au serveur via WebSocket
      if (socketRef.current) {
        socketRef.current.emit("send-chat", { messages: ["adawd"] });
      } else {
        // Fallback sur API REST si WebSocket n'est pas disponible
        const response = await api.chat.sendMessage({ message: messageToSend });

        if (response.data && response.data.reply) {
          // Ajouter la réponse du bot
          addMessage(response.data.reply, "bot");
        }
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
      setError("Erreur lors de l'envoi du message. Veuillez réessayer.");

      // Option: ajouter un message d'erreur visible à l'utilisateur
      addMessage(
        "Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.",
        "bot"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: "url('images/hotel-lobby.webp')" }}
    >
      {/* Affichage des erreurs */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
          {error}
          <button className="ml-2 font-bold" onClick={() => setError(null)}>
            ×
          </button>
        </div>
      )}

      {/* Indicateur de connexion */}
      <div className="absolute top-4 right-4 flex items-center">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${isConnected ? "bg-green-500" : "bg-red-500"}`}
        ></div>
        <span className="text-white text-sm">
          {isConnected ? "Connecté" : "Déconnecté"}
        </span>
      </div>

      {/* Image du réceptionniste */}
      <div className="absolute left-1/6 top-3/5 transform -translate-y-1/2">
        <Image
          src="/images/receptionist_welcomed.webp"
          width={300}
          height={300}
          alt="Receptionist"
          priority
        />
      </div>

      {/* Fenêtre de chat */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full max-w-lg">
        <div className="bg-black bg-opacity-30 rounded-t-lg p-2 text-white text-center">
          Chat avec votre concierge
        </div>

        <div className="h-96 overflow-y-auto mb-4 p-4 bg-white bg-opacity-90 rounded-tr-lg rounded-bl-lg rounded-br-lg shadow-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-lg text-white ${
                  msg.sender === "user" ? "bg-amber-600" : "bg-blue-600"
                } ${msg.sender === "user" ? "rounded-tr-none" : "rounded-tl-none"}`}
                style={{ fontFamily: "Press Start 2P, cursive" }}
              >
                {msg.text}
                <div className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Indicateur de chargement (bot en train d'écrire) */}
          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="px-4 py-3 bg-blue-600 rounded-lg text-white rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Référence pour le défilement automatique */}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tapez un message..."
            disabled={!isConnected || isLoading}
            className="w-full p-3 bg-white border-2 border-gray-300 rounded-l-lg text-black focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!isConnected || isLoading || !input.trim()}
            className="p-3 bg-amber-500 text-white rounded-r-lg hover:bg-amber-600 transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <FaPenFancy />
          </button>
        </form>
      </div>
    </div>
  );
}
