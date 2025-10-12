"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import Button from "@/components/Button";
import { experienceService } from "@/lib/api";
import { ListWsStudents } from "./components/list-ws-students";
import { FaArrowRight } from "react-icons/fa6";
import { WsMessageViewer } from "./components/ws-message-viewer";
import { WsFairCards } from "./components/ws-fair-cards";
import { useWebSocket } from "../../../hooks/useWebSocket";

const experienceTypes = {
  Restaurante: "restaurant",
  Feirinha: "fair",
};

export default function ExperiencePage() {
  const [experienceData, setExperienceData] = useState<any | null>(null);
  const [loadingExperience, setLoadingExperience] = useState(true);
  const [experienceStatus, setExperienceStatus] = useState<
    "BEGINNING" | "ONGOING" | "ENDED"
  >("BEGINNING");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { pin } = useParams<{ pin: string }>();

  // Centralized WebSocket connection
  const { isConnected, lobbyStudents, messages, fairStudents, endExperience } =
    useWebSocket({
      experiencePin: pin || "",
      teacherId: "teacher",
      experienceType:
        experienceTypes[
          experienceData?.templateName as keyof typeof experienceTypes
        ] || null,
    });

  console.log("experienceData?.templateName", experienceData?.templateName);

  // Create a map of studentId to student name for message display
  const studentIdToNameMap = (experienceData?.students || []).reduce(
    (map: Record<string, string>, student: any) => {
      map[student.id] = student.name;
      return map;
    },
    {}
  );

  useEffect(() => {
    const fetchExperienceData = async () => {
      if (!pin) return;

      try {
        setLoadingExperience(true);
        const data = await experienceService.getExperience(pin);
        setExperienceData(data);
        setExperienceStatus(data.status || "BEGINNING");
      } catch (error) {
        console.error("Failed to fetch experience data:", error);
      } finally {
        setLoadingExperience(false);
      }
    };

    fetchExperienceData();
  }, [pin]);

  const updateExperienceStatus = async (
    newStatus: "BEGINNING" | "ONGOING" | "ENDED"
  ) => {
    if (!experienceData?.id) return;

    try {
      setUpdatingStatus(true);
      await experienceService.updateExperienceStatus(
        experienceData.id,
        newStatus
      );
      setExperienceStatus(newStatus);
    } catch (error) {
      console.error("Failed to update experience status:", error);
      // You could add a toast notification here for better UX
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loadingExperience) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!loadingExperience && !experienceData) {
    return (
      <ProtectedLayout>
        <div>Experiência não encontrada</div>
      </ProtectedLayout>
    );
  }

  // Function to get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium";

    switch (status) {
      case "BEGINNING":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "ONGOING":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "ENDED":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800`;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "BEGINNING":
        return "Iniciando";
      case "ONGOING":
        return "Em Andamento";
      case "ENDED":
        return "Finalizada";
      default:
        return status;
    }
  };

  return (
    <ProtectedLayout>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {experienceData?.name || `Experiência PIN: ${pin}`}
            </h1>
            <div className="flex justify-center">
              <span className={getStatusBadge(experienceStatus)}>
                {getStatusText(experienceStatus)}
              </span>
            </div>
          </div>

          {/* Experience Information Card */}
          <div className="bg-primary-dark rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-primary px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Informações da Experiência
              </h2>
            </div>
            <div className="p-6 text-white">
              <div className="space-y-6">
                {/* Experience Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">
                        PIN
                      </span>
                    </div>
                    <p className="text-xl font-bold text-white mt-1">
                      {experienceData.pin}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">
                        Status
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white mt-1">
                      {getStatusText(experienceStatus)}
                    </p>
                  </div>

                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">
                        Cenário
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-white mt-1">
                      {experienceData.templateName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Content Section */}
          <div className="bg-primary-dark rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-primary px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Gerenciamento da Experiência
              </h2>
            </div>
            <div className="p-6">
              {experienceStatus === "BEGINNING" && (
                <div className="space-y-4">
                  <div className="flex gap-4 items-center justify-between">
                    <div className="flex items-center space-x-2 mb-4 ">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-600">
                        Aguardando estudantes se conectarem
                      </span>
                    </div>
                    <Button
                      color="success"
                      size="md"
                      onClick={() => updateExperienceStatus("ONGOING")}
                      disabled={!isConnected || updatingStatus}
                    >
                      <div className="flex items-center">
                        {updatingStatus
                          ? "Iniciando..."
                          : "Iniciar Experiência"}
                        {!updatingStatus && <FaArrowRight className="ml-2" />}
                      </div>
                    </Button>
                  </div>
                  <ListWsStudents
                    expectedStudents={experienceData.students || []}
                    isConnected={isConnected}
                    lobbyStudents={lobbyStudents}
                  />
                </div>
              )}

              {experienceStatus === "ONGOING" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Chat da Experiência
                    </h3>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={async () => {
                        endExperience();
                        await updateExperienceStatus("ENDED");
                      }}
                      disabled={updatingStatus}
                    >
                      {updatingStatus
                        ? "Finalizando..."
                        : "Finalizar Experiência"}
                    </Button>
                  </div>
                  {experienceData.templateName === "Restaurante" && (
                    <WsMessageViewer
                      isConnected={isConnected}
                      messages={messages}
                      studentIdToNameMap={studentIdToNameMap}
                    />
                  )}
                  {experienceData.templateName === "Feirinha" && (
                    <WsFairCards
                      isConnected={isConnected}
                      fairStudents={fairStudents}
                      expectedStudents={experienceData.students || []}
                    />
                  )}
                </div>
              )}

              {experienceStatus === "ENDED" && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-600">
                      Experiência finalizada
                    </span>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-gray-800">
                      Em breve você poderá acessar o relatório da experiência
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
