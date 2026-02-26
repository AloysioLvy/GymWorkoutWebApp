'use client';

import { useState } from 'react';
import { Youtube, Share2, X, Copy, Check } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-semibold text-white">Compartilhar treino</h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-white transition-colors p-1"
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
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-zinc-100 active:scale-95 transition-all min-w-[80px] justify-center"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copiar
              </>
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

  return (
    <div>
      {shareUrl && (
        <ShareModal url={shareUrl} onClose={() => setShareUrl(null)} />
      )}
      {workoutId && (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center gap-2 px-3 py-2 text-xs text-zinc-500 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg transition-colors disabled:opacity-40 min-h-[36px]"
          >
            <Share2 className="w-3.5 h-3.5" />
            {isSharing ? 'Gerando link...' : 'Compartilhar'}
          </button>
        </div>
      )}
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
    </div>
  );
}
