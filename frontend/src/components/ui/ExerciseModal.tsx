'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Exercise } from '@/types';

interface ExerciseModalProps {
  exercise: Exercise;
  onClose: () => void;
}

function Tag({ label, variant }: { label: string; variant: 'blue' | 'emerald' | 'zinc' | 'zinc-dim' }) {
  const styles = {
    blue: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    zinc: 'bg-white/[0.06] text-zinc-400',
    'zinc-dim': 'bg-white/[0.03] text-zinc-500 border border-white/[0.04]',
  };
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize ${styles[variant]}`}>
      {label}
    </span>
  );
}

export default function ExerciseModal({ exercise, onClose }: ExerciseModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg max-h-[90dvh] bg-zinc-950 border border-white/[0.08] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-base font-semibold capitalize leading-snug">{exercise.name}</h2>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-5">

          {exercise.gifUrl && (
            <div className="bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={exercise.gifUrl}
                alt={exercise.name}
                className="w-full max-h-64 object-contain"
              />
            </div>
          )}

          {exercise.bodyParts.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-2">
                Parte do Corpo
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.bodyParts.map((p) => <Tag key={p} label={p} variant="blue" />)}
              </div>
            </div>
          )}

          {exercise.equipments.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-2">
                Equipamento
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.equipments.map((e) => <Tag key={e} label={e} variant="emerald" />)}
              </div>
            </div>
          )}

          {exercise.targetMuscles.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-2">
                Músculos Primários
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.targetMuscles.map((m) => <Tag key={m} label={m} variant="zinc" />)}
              </div>
            </div>
          )}

          {exercise.secondaryMuscles.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-2">
                Músculos Secundários
              </p>
              <div className="flex flex-wrap gap-1.5">
                {exercise.secondaryMuscles.map((m) => <Tag key={m} label={m} variant="zinc-dim" />)}
              </div>
            </div>
          )}

          {exercise.instructions.length > 0 && (
            <div>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest font-medium mb-3">
                Execução
              </p>
              <ol className="space-y-3">
                {exercise.instructions.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 mt-0.5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-semibold text-zinc-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {step.replace(/^Step:\d+\s*/i, '')}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
