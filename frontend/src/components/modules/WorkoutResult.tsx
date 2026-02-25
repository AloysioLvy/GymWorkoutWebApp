'use client';

import { Youtube } from 'lucide-react';
import { WorkoutPlan } from '@/types';

interface WorkoutResultProps {
  plan: WorkoutPlan | null;
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-950 border border-white/[0.06] rounded-xl p-5 animate-pulse">
      <div className="mb-4 pb-4 border-b border-white/[0.06]">
        <div className="h-2.5 w-20 bg-zinc-800 rounded mb-2" />
        <div className="h-3.5 w-32 bg-zinc-800 rounded" />
      </div>
      <div className="space-y-3.5">
        {[0, 1, 2, 3].map((j) => (
          <div key={j}>
            <div className="h-3 w-40 bg-zinc-800 rounded mb-1.5" />
            <div className="h-2.5 w-28 bg-zinc-900 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WorkoutResult({ plan }: WorkoutResultProps) {
  if (!plan) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {plan.days.map((day, i) => (
        <div
          key={i}
          className="bg-zinc-950 border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
        >
          <div className="mb-4 pb-4 border-b border-white/[0.06]">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{day.day}</p>
            <p className="text-sm font-semibold text-white mt-1">{day.focus}</p>
          </div>

          <ul className="space-y-3.5">
            {day.exercises.map((ex, j) => (
              <li key={j}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-zinc-200 leading-snug">{ex.name}</p>
                  {ex.videoUrl && (
                    <a
                      href={ex.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-zinc-600 hover:text-red-500 transition-colors mt-0.5"
                      aria-label={`Ver vídeo: ${ex.name}`}
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {ex.sets} séries · {ex.reps} · {ex.rest} descanso
                </p>
                {ex.notes && (
                  <p className="text-xs text-zinc-700 mt-0.5 italic">{ex.notes}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
