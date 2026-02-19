import { Exercise } from '@/types';
import ExerciseCard from '@/components/ui/ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading: boolean;
  hasSearched: boolean;
}

export default function ExerciseList({ exercises, isLoading, hasSearched }: ExerciseListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-zinc-600 text-sm">
        <div className="w-4 h-4 border-2 border-zinc-800 border-t-zinc-500 rounded-full animate-spin" />
        Buscando exercícios...
      </div>
    );
  }

  if (hasSearched && exercises.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-600 text-sm">
        Nenhum exercício encontrado. Tente um termo diferente.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
