import { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <div
      onClick={() => onClick(exercise)}
      className="bg-zinc-950 border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/20 active:scale-[0.98] transition-all cursor-pointer"
    >
      {exercise.gifUrl && (
        <div className="bg-zinc-900 border-b border-white/[0.06]">
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-40 object-contain"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-sm font-semibold text-white mb-3 capitalize leading-snug">
          {exercise.name}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {exercise.bodyParts.map((part) => (
            <span
              key={part}
              className="px-2 py-0.5 text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md capitalize"
            >
              {part}
            </span>
          ))}
          {exercise.equipments.map((eq) => (
            <span
              key={eq}
              className="px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md capitalize"
            >
              {eq}
            </span>
          ))}
          {exercise.targetMuscles.map((m) => (
            <span key={m} className="px-2 py-0.5 text-xs bg-white/[0.06] text-zinc-400 rounded-md capitalize">
              {m}
            </span>
          ))}
        </div>

        <p className="text-[11px] text-zinc-700 mt-3">
          Toque para ver detalhes
        </p>
      </div>
    </div>
  );
}
