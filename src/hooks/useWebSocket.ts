"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

interface WebSocketStudent {
  name: string;
  socketId: string;
  studentId: string;
  userType: string;
}

interface ChatMessage {
  from: string;
  text: string;
  studentId?: string;
  experienceId?: string;
  timestamp?: string;
}

interface UseWebSocketProps {
  experiencePin: string;
  userType?: "teacher" | "student";
  studentId?: string;
  studentName?: string;
}

const socketUrl =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3002";

export function useWebSocket({
  experiencePin,
  userType = "teacher",
  studentId = "teacher-observer",
  studentName = "Teacher",
}: UseWebSocketProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyStudents, setLobbyStudents] = useState<WebSocketStudent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!experiencePin) return;

    // Create socket connection
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false,
    });

    // Set up event listeners
    newSocket.on("connect", () => {
      console.log(`Connected to WebSocket as ${newSocket.id}`);
      setIsConnected(true);
    });

    newSocket.on("systemMessage", (message: string) => {
      console.log("System message:", message);
    });

    newSocket.on(
      "roomUpdate",
      ({
        experienceId: roomId,
        students,
      }: {
        experienceId: string;
        students: WebSocketStudent[];
      }) => {
        console.log(`Room ${roomId} update:`, students);
        if (roomId === experiencePin) {
          setLobbyStudents(students);
        }
      }
    );

    newSocket.on("chat:message", (message: any) => {
      console.log("Chat message received:", message);
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: message.timestamp
            ? new Date(message.timestamp).toISOString()
            : new Date().toISOString(),
        },
      ]);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
      setLobbyStudents([]);
    });

    // Connect and join room
    newSocket.connect();

    // Join room
    newSocket.emit("joinRoom", {
      experienceId: experiencePin,
      name: studentName,
      studentId: studentId,
      userType: userType,
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit("leaveRoom");
        newSocket.disconnect();
      }
    };
  }, [experiencePin, studentId, studentName]);

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const sendStudentMessage = useCallback(
    (text: string, fromStudentId?: string) => {
      if (socket && socket.connected && text.trim()) {
        socket.emit("chat:studentMessage", {
          studentId: fromStudentId || studentId,
          text: text.trim(),
          experienceId: experiencePin,
        });
      }
    },
    [socket, studentId, experiencePin]
  );

  const sendNpcMessage = useCallback(
    (text: string, fromStudentId?: string) => {
      if (socket && socket.connected && text.trim()) {
        socket.emit("chat:npcMessage", {
          studentId: fromStudentId || studentId,
          text: text.trim(),
          experienceId: experiencePin,
        });
      }
    },
    [socket, studentId, experiencePin]
  );

  return {
    socket,
    isConnected,
    lobbyStudents,
    messages,
    sendStudentMessage,
    sendNpcMessage,
  };
}
