"use client";

interface Student {
  id: string;
  name: string;
}

interface WebSocketStudent {
  name: string;
  socketId: string;
  studentId: string;
  userType: string;
}

interface ListWsStudentsProps {
  expectedStudents: Student[];
  isConnected: boolean;
  lobbyStudents: WebSocketStudent[];
}

export function ListWsStudents({
  expectedStudents,
  isConnected,
  lobbyStudents,
}: ListWsStudentsProps) {
  const onlineCount = expectedStudents.filter((student) =>
    lobbyStudents.some((lobbyStudent) => lobbyStudent.studentId === student.id)
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
          const isOnline = lobbyStudents.some(
            (lobbyStudent) => lobbyStudent.studentId === student.id
          );
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
