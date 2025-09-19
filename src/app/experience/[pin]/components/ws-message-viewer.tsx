"use client";

import { useEffect, useRef } from "react";

interface ChatMessage {
  from: string;
  text: string;
  studentId?: string;
  experienceId?: string;
  timestamp?: string;
}

interface WsMessageViewerProps {
  isConnected: boolean;
  messages: ChatMessage[];
  studentIdToNameMap: Record<string, string>;
}

export function WsMessageViewer({
  isConnected,
  messages,
  studentIdToNameMap,
}: WsMessageViewerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Chat da Experiência</h2>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
            }`}
          ></div>
          <span className="text-sm font-medium text-gray-600">
            {isConnected ? "Experiência em andamento" : "Desconectado"}
          </span>
        </div>
        <span className="text-xs text-gray-500">
          {messages.length} mensagens
        </span>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg h-96 flex flex-col">
        <div className="flex-1 overflow-y-auto p-2">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Nenhuma mensagem ainda</p>
              <p className="text-xs text-gray-400 mt-1">
                As mensagens dos estudantes aparecerão aqui
              </p>
            </div>
          ) : (
            <ul className="list-none p-0 m-0 space-y-1">
              {messages.map((message, index) => (
                <li
                  key={index}
                  className={`p-2 rounded-lg border text-sm ${
                    message.from === "student"
                      ? "bg-green-100 border-green-500 text-left"
                      : message.from === "npc"
                      ? "bg-red-100 border-red-500 text-left"
                      : "bg-gray-50 border-gray-500 text-left"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-medium text-primary-dark">
                      [{message.from}
                      {message.studentId
                        ? ` ${
                            studentIdToNameMap[message.studentId] ||
                            message.studentId
                          }`
                        : ""}
                      ] {message.text}
                    </span>
                    {message.timestamp && (
                      <span className="text-xs text-black ml-2 flex-shrink-0">
                        {formatTime(message.timestamp)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isConnected && (
          <div className="p-3 bg-red-50 border-t border-red-200 rounded-b-lg">
            <p className="text-sm text-red-700 text-center">
              ⚠️ Desconectado do WebSocket. Tentando reconectar...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
