import { Exercise } from '@/lib/api';
import ExerciseCard from './ExerciseCard';

interface ExerciseListProps {
  exercises: Exercise[];
  isLoading: boolean;
  hasSearched: boolean;
}

export default function ExerciseList({
  exercises,
  isLoading,
  hasSearched,
}: ExerciseListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Searching exercises...
      </div>
    );
  }

  if (hasSearched && exercises.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No exercises found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
