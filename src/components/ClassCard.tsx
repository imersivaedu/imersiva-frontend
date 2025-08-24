import { FaUsers, FaGraduationCap } from "react-icons/fa";

interface ClassCardProps {
  id: string;
  name: string;
  grade: number;
  onClick?: () => void;
}

export function ClassCard({ id, name, grade, onClick }: ClassCardProps) {
  return (
    <div
      className="bg-primary-dark rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <FaGraduationCap className="text-white text-xl" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">Série {grade}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center text-gray-500 text-sm">
        <FaUsers className="mr-2" />
        <span>Turma ativa</span>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-primary hover:text-primary-dark text-sm font-medium">
          Ver detalhes →
        </button>
      </div>
    </div>
  );
}
