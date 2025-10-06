"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ClassGrid } from "@/components/ClassGrid";
import { ExperienceModal } from "@/components/ExperienceModal";
import { ProtectedLayout } from "@/components/ProtectedLayout";
import {
  schoolService,
  SchoolWithClasses,
  experienceService,
  CreateExperienceRequest,
} from "@/lib/api";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import Button from "@/components/Button";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [schoolData, setSchoolData] = useState<SchoolWithClasses | null>(null);
  const [loadingSchool, setLoadingSchool] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creatingExperience, setCreatingExperience] = useState(false);

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (!user) return;

      try {
        setLoadingSchool(true);
        // Using the mocked school ID as requested
        const data = await schoolService.getSchoolWithClasses();
        setSchoolData(data);
      } catch (error) {
        console.error("Failed to fetch school data:", error);
      } finally {
        setLoadingSchool(false);
      }
    };

    fetchSchoolData();
  }, [user]);

  const handleClassClick = (classId: string) => {
    // TODO: Navigate to class details page
    console.log("Class clicked:", classId);
  };

  const handleCreateExperience = async (data: CreateExperienceRequest) => {
    try {
      setCreatingExperience(true);
      const experience = await experienceService.createExperience(data);
      console.log("Experience created:", experience);

      toast.success("Experiência criada com sucesso!");
      router.push(`/experience/${experience.pin}`);
    } catch (error) {
      console.error("Failed to create experience:", error);
      toast.error("Erro ao criar experiência. Tente novamente.");
      throw error;
    } finally {
      setCreatingExperience(false);
    }
  };

  return (
    <ProtectedLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Aqui está um resumo das suas atividades educacionais.
          </p>
        </div>
        <Button
          color="primary"
          size="md"
          onClick={() => {
            setIsModalOpen(true);
          }}
          disabled={creatingExperience || loadingSchool}
        >
          <div className="flex items-center">
            Criar Experiência
            <FaPlus className="ml-2" />
          </div>
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Ativos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">👥</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Estudantes</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🎯</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Experiências</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Section */}
      <div className="mt-8">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {schoolData ? `Turmas - ${schoolData.name}` : "Suas Turmas"}
          </h3>
          <p className="text-gray-600">
            Gerencie suas turmas e acompanhe o progresso dos estudantes.
          </p>
        </div>

        {loadingSchool ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <ClassGrid
            classes={schoolData?.Class || []}
            onClassClick={handleClassClick}
          />
        )}
      </div>

      {/* Experience Modal */}
      <ExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateExperience}
        classes={schoolData?.Class || []}
        loading={loadingSchool}
      />
    </ProtectedLayout>
  );
}
