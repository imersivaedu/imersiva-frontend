"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface Student {
  id: string;
  name: string;
}

const socketUrl =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3002";

interface ListWsStudentsProps {
  expectedStudents: Student[];
  experiencePin: string; // Experience/Room ID for WebSocket connection
}

export function ListWsStudents({
  expectedStudents,
  experiencePin,
}: ListWsStudentsProps) {
  const [lobbyStudents, setLobbyStudents] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

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
        students: string[];
      }) => {
        console.log(`Room ${roomId} update:`, students);
        if (roomId === experiencePin) {
          setLobbyStudents(students);
        }
      }
    );

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
      setLobbyStudents([]);
    });

    // Connect and join room as observer (teacher/admin view)
    newSocket.connect();

    // Join room to observe student connections
    newSocket.emit("joinRoom", {
      experienceId: experiencePin,
      name: "Teacher",
      studentId: "teacher-observer",
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit("leaveRoom");
        newSocket.disconnect();
      }
    };
  }, [experiencePin, socketUrl]);

  // Cleanup socket on component unmount
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  const onlineCount = expectedStudents.filter((student) =>
    lobbyStudents.includes(student.name)
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Estudantes: {onlineCount}/{expectedStudents.length}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-xs ${
                isConnected ? "text-green-600" : "text-red-600"
              }`}
            >
              {isConnected ? "WebSocket Conectado" : "WebSocket Desconectado"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span className="text-gray-600">Offline</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {expectedStudents.map((student) => {
          const isOnline = lobbyStudents.includes(student.name);

          return (
            <div
              key={student.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isOnline
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
                <span
                  className={`font-medium ${
                    isOnline ? "text-green-900" : "text-gray-700"
                  }`}
                >
                  {student.name}
                </span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {isOnline ? "No lobby" : "Offline"}
              </span>
            </div>
          );
        })}
      </div>

      {expectedStudents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum estudante esperado para esta experiência</p>
        </div>
      )}
    </div>
  );
}
