'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  LayoutDashboard, Search, Zap, LogOut, Dumbbell,
  ChevronRight, Menu, X, Clock, RefreshCw,
} from 'lucide-react';
import WorkoutResult from '@/components/modules/WorkoutResult';
import OnboardingFlow from '@/components/modules/OnboardingFlow';
import SearchBar from '@/components/ui/SearchBar';
import ExerciseList from '@/components/common/ExerciseList';
import { Exercise, WorkoutRecord } from '@/types';
import { generateWorkout, getWorkoutById, getWorkoutsByUser, searchExercises, setCachedWorkouts } from '@/services/api';
import { handleSignOut } from '@/lib/auth-actions';

type View = 'dashboard' | 'search';

interface SidebarProps {
  view: View;
  recentWorkouts: WorkoutRecord[];
  selectedWorkout: WorkoutRecord | null;
  isGenerating: boolean;
  reachedLimit: boolean;
  userName: string;
  onViewChange: (v: View) => void;
  onSelectWorkout: (w: WorkoutRecord) => void;
  onGenerate: () => void;
  onClose?: () => void;
}

function Sidebar({
  view, recentWorkouts, selectedWorkout, isGenerating, reachedLimit, userName,
  onViewChange, onSelectWorkout, onGenerate, onClose,
}: SidebarProps) {
  function nav(v: View) { onViewChange(v); onClose?.(); }
  function pick(w: WorkoutRecord) { onSelectWorkout(w); onViewChange('dashboard'); onClose?.(); }
  function generate() { onGenerate(); onClose?.(); }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0">
            <Dumbbell className="w-4 h-4 text-black" />
          </div>
          <span className="text-sm font-semibold tracking-tight">GymAI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {([
          { id: 'dashboard' as View, label: 'Dashboard', Icon: LayoutDashboard },
          { id: 'search' as View, label: 'Busca de Exercícios', Icon: Search },
        ] as const).map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => nav(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              view === id
                ? 'bg-white/[0.08] text-white'
                : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}

        {/* Treinos recentes */}
        {recentWorkouts.length > 0 && (
          <div className="pt-5 mt-3 border-t border-white/[0.06]">
            <p className="px-3 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">
              Recentes
            </p>
            {recentWorkouts.map((w) => (
              <button
                key={w.id}
                onClick={() => pick(w)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group ${
                  selectedWorkout?.id === w.id && view === 'dashboard'
                    ? 'bg-white/[0.08] text-white'
                    : 'text-zinc-500 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {w.status === 'pending' || w.status === 'processing'
                  ? <RefreshCw className="w-3.5 h-3.5 shrink-0 text-zinc-600 animate-spin" />
                  : <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                }
                <span className="truncate text-left flex-1 text-xs">{w.name}</span>
                <ChevronRight className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Gerar Treino CTA */}
      <div className="px-3 pb-3 pt-4 border-t border-white/[0.06]">
        <button
          onClick={generate}
          disabled={isGenerating || reachedLimit}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Zap className="w-4 h-4" />
          {isGenerating ? 'Gerando...' : 'Gerar Treino'}
        </button>
        {reachedLimit && (
          <p className="mt-2 text-[10px] text-center text-zinc-500">
            Limite de 2 treinos atingido.
          </p>
        )}
      </div>

      {/* Usuário */}
      <div className="px-4 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-300 shrink-0">
            {userName[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-zinc-500 truncate flex-1">{userName}</span>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 flex items-center justify-center min-h-[44px] min-w-[44px]"
              aria-label="Sair"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

interface WorkoutDashboardProps {
  userId: string;
  userName: string;
  initialHasProfile: boolean;
}

export default function WorkoutDashboard({ userId, userName }: WorkoutDashboardProps) {
  const [view, setView] = useState<View>('dashboard');
  const [workouts, setWorkouts] = useState<WorkoutRecord[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRecord | null>(null);
  const [isLoadingWorkouts, setIsLoadingWorkouts] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    getWorkoutsByUser(userId)
      .then((data) => {
        setWorkouts(data);
        if (data.length > 0) setSelectedWorkout(data[0]);
      })
      .catch(() => {})
      .finally(() => setIsLoadingWorkouts(false));
  }, [userId]);

  // Polling: enquanto houver workout pending/processing, consulta a cada 3s
  useEffect(() => {
    const pending = workouts.find(
      (w) => w.status === 'pending' || w.status === 'processing',
    );
    if (!pending) return;

    const timer = setTimeout(async () => {
      try {
        const updated = await getWorkoutById(pending.id);
        setWorkouts((prev) => {
          const next = prev.map((w) => (w.id === updated.id ? updated : w));
          setCachedWorkouts(userId, next);
          return next;
        });
        setSelectedWorkout((prev) => (prev?.id === updated.id ? updated : prev));
      } catch {
        // ignora erros de rede durante polling
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [workouts, userId]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) { setExercises([]); setHasSearched(false); return; }
    setIsSearching(true);
    setHasSearched(true);
    const results = await searchExercises(query);
    setExercises(results);
    setIsSearching(false);
  }, []);

  async function handleGenerateWorkout() {
   setIsGenerating(true);
    setGenerateError('');
    try {
      const newWorkout = await generateWorkout(userId);
      setWorkouts((prev) => [newWorkout, ...prev]);
      setSelectedWorkout(newWorkout);
      setView('dashboard');
    } catch {
      setGenerateError('Falha ao gerar treino. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  }

  if (showOnboarding) {
    return (
      <OnboardingFlow
        userId={userId}
        userName={userName}
        onComplete={() => setShowOnboarding(false)}
      />
    );
  }

  const reachedLimit = workouts.length >= 5;

  const sidebarProps: SidebarProps = {
    view,
    recentWorkouts: workouts.slice(0, 3),
    selectedWorkout,
    isGenerating,
    reachedLimit,
    userName,
    onViewChange: setView,
    onSelectWorkout: setSelectedWorkout,
    onGenerate: handleGenerateWorkout,
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Overlay do drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-60 bg-zinc-950 border-r border-white/[0.06] z-30">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* Drawer mobile */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-zinc-950 border-r border-white/[0.06] z-30 transition-transform duration-300 ease-in-out lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setDrawerOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
        <Sidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* Área principal */}
      <div className="lg:ml-60 flex flex-col min-h-screen">
        {/* Header mobile */}
        <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-black/80 backdrop-blur-xl border-b border-white/[0.06]">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-zinc-400 hover:text-white p-2 -ml-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-tight">GymAI</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Conteúdo */}
        <main className="flex-1 px-5 py-8 lg:px-10 max-w-4xl w-full mx-auto pb-28 lg:pb-12">

          {/* View: Dashboard */}
          {view === 'dashboard' && (
            isLoadingWorkouts ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-5 h-5 border-2 border-zinc-800 border-t-white rounded-full animate-spin" />
              </div>
            ) : selectedWorkout ? (
              <div>
                <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
                  <div>
                    <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium mb-1.5">
                      Plano Atual
                    </p>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-2xl font-semibold leading-tight">{selectedWorkout.name}</h1>
                      {(selectedWorkout.status === 'pending' || selectedWorkout.status === 'processing') && (
                        <RefreshCw className="w-4 h-4 text-zinc-500 animate-spin shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 mt-1">
                      {new Date(selectedWorkout.createdAt).toLocaleDateString('pt-BR', {
                        month: 'long', day: 'numeric', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowOnboarding(true)}
                      className="px-3 py-2 text-xs text-zinc-500 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg transition-colors min-h-[36px]"
                    >
                      Atualizar treino
                    </button>
                  </div>
                </div>
                {generateError && (
                  <p className="text-red-400 text-sm mb-6">{generateError}</p>
                )}
                <WorkoutResult plan={selectedWorkout.aiOutput} workoutId={selectedWorkout.id} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/[0.08] flex items-center justify-center">
                  <Dumbbell className="w-7 h-7 text-zinc-600" />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium">Nenhum treino ainda</p>
                  <p className="text-zinc-500 text-sm">Gere seu primeiro plano de treino personalizado</p>
                </div>
                <button
                  onClick={handleGenerateWorkout}
                  disabled={isGenerating || reachedLimit}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 transition-all min-h-[44px]"
                >
                  <Zap className="w-4 h-4" />
                  {isGenerating ? 'Gerando...' : 'Gerar Treino'}
                </button>
                {reachedLimit && (
                  <p className="text-zinc-500 text-sm">Limite de 5 treinos por usuário atingido.</p>
                )}
                {generateError && <p className="text-red-400 text-sm">{generateError}</p>}
              </div>
            )
          )}

          {/* View: Busca */}
          {view === 'search' && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-medium mb-1.5">Biblioteca</p>
                <h1 className="text-2xl font-semibold">Busca de Exercícios</h1>
              </div>
              <SearchBar onSearch={handleSearch} />
              <div className="mt-8">
                <ExerciseList exercises={exercises} isLoading={isSearching} hasSearched={hasSearched} />
              </div>
            </div>
          )}
        </main>

        {/* Navegação inferior mobile */}
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-zinc-950/95 backdrop-blur-xl border-t border-white/[0.06] z-10">
          <div className="flex items-center justify-around px-6 h-16">
            <button
              onClick={() => setView('dashboard')}
              className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[64px] justify-center px-3 transition-colors ${
                view === 'dashboard' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] font-medium">Dashboard</span>
            </button>

            <button
              onClick={handleGenerateWorkout}
              disabled={isGenerating || reachedLimit}
              className="flex flex-col items-center gap-1 bg-white text-black rounded-2xl min-h-[52px] min-w-[88px] justify-center px-4 disabled:opacity-40 active:scale-95 transition-all"
            >
              <Zap className={`w-5 h-5 ${isGenerating ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-bold">{isGenerating ? 'Aguarde...' : 'Gerar'}</span>
            </button>

            <button
              onClick={() => setView('search')}
              className={`flex flex-col items-center gap-1 min-h-[44px] min-w-[64px] justify-center px-3 transition-colors ${
                view === 'search' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-medium">Buscar</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
