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

interface FairStudentState {
  studentId: string;
  name?: string;
  points: number;
  customerOrder?: {
    list: Array<{
      fruit: { name: string };
      amount: number;
    }>;
  };
  lastTranscription?: string;
  wasLastDoneCorrect: boolean;
  fruitsOnTent?: {
    list: Array<{
      fruit: { name: string };
      amount: number;
    }>;
    amountOnOrder: number;
  };
}

interface UseWebSocketProps {
  experiencePin: string;
  teacherId?: string;
  experienceType: string | null;
}

const socketUrl =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3002";

export function useWebSocket({
  experiencePin,
  teacherId,
  experienceType,
}: UseWebSocketProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lobbyStudents, setLobbyStudents] = useState<WebSocketStudent[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [fairStudents, setFairStudents] = useState<
    Record<string, FairStudentState>
  >({});

  // Effect 1: Create and manage socket connection
  useEffect(() => {
    if (!experiencePin || !experienceType) return;

    console.log("Creating WebSocket connection...");

    // Create socket connection
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      autoConnect: false,
    });

    // Set up core connection event listeners
    const handleConnect = () => {
      console.log(`Connected to WebSocket as ${newSocket.id}`);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
      setLobbyStudents([]);
    };

    const handleSystemMessage = (message: string) => {
      console.log("System message:", message);
    };

    const handleRoomUpdate = ({
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
    };

    const handleChatMessage = (message: any) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: message.timestamp
            ? new Date(message.timestamp).toISOString()
            : new Date().toISOString(),
        },
      ]);
    };

    const handleFairStateUpdate = ({
      studentId,
      state,
    }: {
      studentId: string;
      state: any;
    }) => {
      console.log("Fair state update received:", studentId, state);
      setFairStudents((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          studentId,
          ...state,
        },
      }));
    };

    const handleTeacherStudentsState = (allStudents: any[]) => {
      console.log("Teacher students state received:", allStudents);
      const studentsMap: Record<string, FairStudentState> = {};
      for (const student of allStudents) {
        studentsMap[student.studentId] = {
          studentId: student.studentId,
          name: student.name,
          points: student.points || 0,
          customerOrder: student.customerOrder,
          lastTranscription: student.lastTranscription,
          wasLastDoneCorrect: student.wasLastDoneCorrect || false,
          fruitsOnTent: student.fruitsOnTent,
        };
      }
      setFairStudents(studentsMap);
    };

    // Attach event listeners based on experience type
    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("systemMessage", handleSystemMessage);
    newSocket.on("roomUpdate", handleRoomUpdate);

    // Experience-specific event listeners
    if (experienceType === "restaurant") {
      newSocket.on("chat:message", handleChatMessage);
    } else if (experienceType === "fair") {
      newSocket.on("fair:stateUpdate", handleFairStateUpdate);
      newSocket.on("teacher:studentsState", handleTeacherStudentsState);
    }

    // Connect to server
    newSocket.connect();
    setSocket(newSocket);

    // Cleanup function
    return () => {
      console.log("Cleaning up WebSocket connection...");

      // Remove event listeners
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("systemMessage", handleSystemMessage);
      newSocket.off("roomUpdate", handleRoomUpdate);

      // Remove experience-specific listeners
      newSocket.off("chat:message", handleChatMessage);
      newSocket.off("fair:stateUpdate", handleFairStateUpdate);
      newSocket.off("teacher:studentsState", handleTeacherStudentsState);

      // Disconnect and cleanup
      if (newSocket.connected) {
        newSocket.emit("leaveExperience");
        newSocket.disconnect();
      }

      setSocket(null);
      setIsConnected(false);
      setLobbyStudents([]);
      setMessages([]);
      setFairStudents({});
    };
  }, [experiencePin, experienceType]); // Depend on both experiencePin and experienceType

  // Effect 2: Handle joining/leaving rooms when parameters change
  useEffect(() => {
    if (!socket || !socket.connected || !experienceType) return;

    console.log(`Joining room with type: ${experienceType}`);

    socket.emit("joinTeacher", {
      experienceId: experiencePin,
      teacherId: teacherId,
      type: experienceType,
    });

    // Cleanup function to leave room when parameters change
    return () => {
      if (socket && socket.connected) {
        console.log("Leaving experience due to parameter change...");
        socket.emit("leaveExperience");
      }
    };
  }, [socket, isConnected, experiencePin, teacherId, experienceType]);

  // Function to end experience
  const endExperience = useCallback(() => {
    if (socket && socket.connected && experiencePin) {
      console.log("Ending experience:", experiencePin);
      socket.emit("endExperience", experiencePin);
    }
  }, [socket, experiencePin]);

  return {
    socket,
    isConnected,
    lobbyStudents,
    messages,
    fairStudents,
    endExperience,
  };
}
