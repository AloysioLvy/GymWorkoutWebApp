import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Dumbbell, Zap } from 'lucide-react';
import WorkoutResult from '@/components/modules/WorkoutResult';
import type { WorkoutPlan } from '@/types';

interface SharedWorkoutData {
  id: string;
  name: string;
  status: string;
  aiOutput: WorkoutPlan | null;
  createdAt: string;
}

async function getSharedWorkout(token: string): Promise<SharedWorkoutData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/shared/${token}`, {
      cache: 'no-store',
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function SharedWorkoutPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const workout = await getSharedWorkout(token);

  if (!workout) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/[0.06] px-5 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
              <Dumbbell className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">GymAI</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Crie o seu treino
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-10 lg:px-10">
        <div className="mb-8">
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium mb-1.5">
            Treino Compartilhado
          </p>
          <h1 className="text-2xl font-semibold">{workout.name}</h1>
          <p className="text-sm text-zinc-600 mt-1">
            {new Date(workout.createdAt).toLocaleDateString('pt-BR', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <WorkoutResult plan={workout.aiOutput} />

        <div className="mt-12 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-zinc-500 text-sm mb-4">
            Quer um treino personalizado para você?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] transition-all"
          >
            <Zap className="w-4 h-4" />
            Crie seu treino personalizado
          </Link>
        </div>
      </main>
    </div>
  );
}
