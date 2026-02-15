import { Exercise } from '@/lib/api';

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {exercise.gifUrl && (
        <img
          src={exercise.gifUrl}
          alt={exercise.name}
          className="w-full h-48 object-contain rounded-lg mb-4 bg-gray-50"
        />
      )}

      <h3 className="text-xl font-semibold text-gray-900 mb-2 capitalize">
        {exercise.name}
      </h3>

      {exercise.bodyParts && exercise.bodyParts.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {exercise.bodyParts.map((part) => (
            <span
              key={part}
              className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full capitalize"
            >
              {part}
            </span>
          ))}
        </div>
      )}

      {exercise.equipments && exercise.equipments.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {exercise.equipments.map((eq) => (
            <span
              key={eq}
              className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded capitalize"
            >
              {eq}
            </span>
          ))}
        </div>
      )}

      {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {exercise.targetMuscles.map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded capitalize"
            >
              {muscle}
            </span>
          ))}
          {exercise.secondaryMuscles?.map((muscle) => (
            <span
              key={muscle}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded capitalize"
            >
              {muscle}
            </span>
          ))}
        </div>
      )}

      {exercise.instructions && exercise.instructions.length > 0 && (
        <details className="mt-3">
          <summary className="text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
            Instructions ({exercise.instructions.length} steps)
          </summary>
          <ol className="mt-2 space-y-1 text-sm text-gray-600 list-decimal list-inside">
            {exercise.instructions.map((step, i) => (
              <li key={i}>{step.replace(/^Step:\d+\s*/i, '')}</li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
}
