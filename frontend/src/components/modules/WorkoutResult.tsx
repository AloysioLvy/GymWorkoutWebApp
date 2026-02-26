'use client';

import { useState } from 'react';
import { Youtube, Share2, X, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { WorkoutPlan } from '@/types';
import { shareWorkout } from '@/services/api';

interface WorkoutResultProps {
  plan: WorkoutPlan | null;
  workoutId?: string;
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

function ShareModal({ url, onClose }: { url: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-zinc-950 border border-white/[0.08] rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-8 h-1 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Compartilhar treino</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mb-3">
          Qualquer pessoa com este link pode visualizar o treino sem precisar fazer login.
        </p>

        <div className="flex items-center gap-2 p-3 bg-zinc-900 rounded-lg border border-white/[0.06]">
          <p className="text-xs text-zinc-300 truncate flex-1 font-mono">{url}</p>
          <button
            onClick={handleCopy}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-100 active:scale-95 transition-all min-w-[80px] min-h-[44px] justify-center"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5" />Copiado!</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />Copiar</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkoutResult({ plan, workoutId }: WorkoutResultProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  async function handleShare() {
    if (!workoutId) return;
    setIsSharing(true);
    try {
      const url = await shareWorkout(workoutId);
      setShareUrl(url);
    } catch {
      // silently ignore
    } finally {
      setIsSharing(false);
    }
  }

  if (!plan) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const day = plan.days[activeDay];

  return (
    <div>
      {shareUrl && <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />}

      {workoutId && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg transition-colors disabled:opacity-40 min-h-[44px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isSharing ? 'Gerando link...' : 'Compartilhar'}
          </button>
        </div>
      )}

      {/* Mobile: day tabs + single card */}
      <div className="lg:hidden">
        {/* Tab strip */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveDay((d) => Math.max(0, d - 1))}
            disabled={activeDay === 0}
            className="p-2 rounded-lg text-zinc-600 hover:text-white disabled:opacity-20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 overflow-x-auto scrollbar-none">
            <div className="flex gap-1.5 min-w-max">
              {plan.days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
                    activeDay === i
                      ? 'bg-white text-black'
                      : 'text-zinc-500 hover:text-white bg-white/[0.04]'
                  }`}
                >
                  {d.day}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveDay((d) => Math.min(plan.days.length - 1, d + 1))}
            disabled={activeDay === plan.days.length - 1}
            className="p-2 rounded-lg text-zinc-600 hover:text-white disabled:opacity-20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Active day card */}
        {day && (
          <div className="bg-zinc-950 border border-white/[0.06] rounded-xl p-5">
            <div className="mb-4 pb-4 border-b border-white/[0.06]">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{day.day}</p>
              <p className="text-sm font-semibold text-white mt-1">{day.focus}</p>
            </div>
            <ul className="space-y-4">
              {day.exercises.map((ex, j) => (
                <li key={j}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-zinc-200 leading-snug">{ex.name}</p>
                    {ex.videoUrl && (
                      <a
                        href={ex.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-zinc-600 hover:text-red-500 transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center -mr-1"
                        aria-label={`Ver vídeo: ${ex.name}`}
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    {ex.sets} séries · {ex.reps} · {ex.rest} descanso
                  </p>
                  {ex.notes && (
                    <p className="text-xs text-zinc-700 mt-0.5 italic">{ex.notes}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Day counter */}
        <p className="text-center text-xs text-zinc-700 mt-3">
          {activeDay + 1} de {plan.days.length} dias
        </p>
      </div>

      {/* Desktop: full grid */}
      <div className="hidden lg:grid gap-3 lg:grid-cols-3">
        {plan.days.map((d, i) => (
          <div
            key={i}
            className="bg-zinc-950 border border-white/[0.06] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
          >
            <div className="mb-4 pb-4 border-b border-white/[0.06]">
              <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">{d.day}</p>
              <p className="text-sm font-semibold text-white mt-1">{d.focus}</p>
            </div>
            <ul className="space-y-3.5">
              {d.exercises.map((ex, j) => (
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
    </div>
  );
}
