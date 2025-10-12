"use client";

import { useState } from "react";
import { FruitList } from "../../../../components/FruitList";

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

interface WsFairCardsProps {
  isConnected: boolean;
  fairStudents: Record<string, FairStudentState>;
  expectedStudents: Array<{ id: string; name: string }>;
}

export function WsFairCards({
  isConnected,
  fairStudents,
  expectedStudents,
}: WsFairCardsProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const getStudentData = (expectedStudent: { id: string; name: string }) => {
    const fairData = fairStudents[expectedStudent.id];
    return {
      ...expectedStudent,
      ...fairData,
      hasData: !!fairData,
    };
  };

  const toggleExpanded = (studentId: string) => {
    setExpandedCard(expandedCard === studentId ? null : studentId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Status dos Estudantes - Feira
        </h2>
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
      </div>

      {expectedStudents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum estudante esperado para esta experiência</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {expectedStudents.map((expectedStudent) => {
            const student = getStudentData(expectedStudent);
            const isExpanded = expandedCard === student.id;

            return (
              <div
                key={student.id}
                className={`rounded-lg shadow-md border-2 transition-all duration-200 bg-white/10 ${
                  student.hasData
                    ? "border-green-700 hover:border-green-800"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Card Header */}
                <div
                  className={`p-4 rounded-t-lg ${
                    student.hasData ? "bg-green-600" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          student.hasData ? "bg-green-300" : "bg-gray-300"
                        }`}
                      />
                      <h3 className="font-semibold text-gray-900">
                        {student.name}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        student.hasData
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.hasData ? "Ativo" : "Sem dados"}
                    </span>
                  </div>
                </div>

                {/* Card Body - Priority Fields */}
                <div className="p-4 space-y-3">
                  {student.hasData ? (
                    <>
                      {/* Points */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">
                          Pontos:
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {student.points || 0}
                        </span>
                      </div>

                      {/* Customer Order */}
                      <div>
                        <span className="text-sm font-medium block mb-1">
                          Pedido do Cliente:
                        </span>
                        <div className="bg-yellow-100 p-2 rounded border">
                          <FruitList
                            fruitList={student.customerOrder?.list}
                            emptyMessage="Nenhum pedido"
                            size={28}
                          />
                        </div>
                      </div>

                      {/* Fruits on Tent */}
                      <div>
                        <span className="text-sm font-medium block mb-1">
                          Frutas na Barraca:
                        </span>
                        <div className="bg-blue-100 p-2 rounded border">
                          <FruitList
                            fruitList={student.fruitsOnTent?.list}
                            emptyMessage="Nenhuma fruta"
                            size={28}
                          />
                        </div>
                      </div>

                      {/* Expandable Section Toggle */}
                      {(student.lastTranscription ||
                        student.wasLastDoneCorrect !== undefined) && (
                        <button
                          onClick={() => toggleExpanded(student.id)}
                          className="w-full mt-3 text-xs text-primary hover:text-blue-600 cursor-pointer border-t pt-2 transition-colors"
                        >
                          {isExpanded ? "Ocultar detalhes ↑" : "Ver detalhes ↓"}
                        </button>
                      )}

                      {/* Expandable Section - Secondary Fields */}
                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                          {student.lastTranscription && (
                            <div>
                              <span className="text-xs font-medium text-gray-600 block mb-1">
                                Última Transcrição:
                              </span>
                              <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded border italic">
                                "{student.lastTranscription}"
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-gray-600">
                              Última resposta correta:
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                student.wasLastDoneCorrect
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.wasLastDoneCorrect ? "Sim" : "Não"}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">Aguardando dados do estudante</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isConnected && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 text-center">
            ⚠️ Desconectado do WebSocket. Tentando reconectar...
          </p>
        </div>
      )}
    </div>
  );
}
