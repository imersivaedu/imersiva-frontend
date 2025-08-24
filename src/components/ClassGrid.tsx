import { ClassCard } from "./ClassCard";

interface Class {
  id: string;
  name: string;
  grade: number;
}

interface ClassGridProps {
  classes: Class[];
  onClassClick?: (classId: string) => void;
}

export function ClassGrid({ classes, onClassClick }: ClassGridProps) {
  if (classes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">🎓</div>
        <p className="text-gray-600 font-medium">Nenhuma turma encontrada.</p>
        <p className="text-gray-500 text-sm mt-2">
          As turmas aparecerão aqui quando estiverem disponíveis.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((classItem) => (
        <ClassCard
          key={classItem.id}
          id={classItem.id}
          name={classItem.name}
          grade={classItem.grade}
          onClick={() => onClassClick?.(classItem.id)}
        />
      ))}
    </div>
  );
}
