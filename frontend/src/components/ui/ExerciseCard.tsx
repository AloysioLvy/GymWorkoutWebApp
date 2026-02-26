import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <div
      onClick={() => onClick(exercise)}
      className="bg-zinc-950 border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/20 hover:bg-zinc-900/50 transition-all cursor-pointer"
    >
      {exercise.gifUrl && (
        <div className="bg-zinc-900 border-b border-white/[0.06]">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-44 object-contain"
          />
        </div>
      )}

      <div className="p-5">
        <h3 className="text-sm font-semibold text-white mb-3 capitalize leading-snug">
          {exercise.name}
        </h3>

        {exercise.bodyParts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exercise.bodyParts.map((part) => (
              <span
                key={part}
                className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md capitalize"
              >
                {part}
              </span>
            ))}
          </div>
        )}

        {exercise.equipments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exercise.equipments.map((eq) => (
              <span
                key={eq}
                className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md capitalize"
              >
                {eq}
              </span>
            ))}
          </div>
        )}

        {exercise.targetMuscles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {exercise.targetMuscles.map((m) => (
              <span key={m} className="px-2 py-0.5 text-xs bg-white/[0.06] text-zinc-400 rounded-md capitalize">
                {m}
              </span>
            ))}
            {exercise.secondaryMuscles.map((m) => (
              <span key={m} className="px-2 py-0.5 text-xs bg-white/[0.03] text-zinc-600 rounded-md capitalize">
                {m}
              </span>
            ))}
          </div>
        )}

        {exercise.instructions.length > 0 && (
          <details className="mt-4 group">
            <summary className="text-xs font-medium text-zinc-600 cursor-pointer hover:text-zinc-400 transition-colors list-none flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 border border-zinc-700 rounded flex items-center justify-center text-[10px] group-open:bg-white/[0.06]">
                +
              </span>
              Instruções ({exercise.instructions.length} passos)
            </summary>
            <ol className="mt-3 space-y-1.5 text-xs text-zinc-600 list-decimal list-inside">
              {exercise.instructions.map((step, i) => (
                <li key={i}>{step.replace(/^Step:\d+\s*/i, '')}</li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
}
