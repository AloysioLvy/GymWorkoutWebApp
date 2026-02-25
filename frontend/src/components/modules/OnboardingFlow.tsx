'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Dumbbell } from 'lucide-react';
import { generateWorkout, updateGymProfile } from '@/services/api';

interface OnboardingFlowProps {
  userId: string;
  userName: string;
  onComplete?: () => void;
}

type Answers = {
  goal: string;
  fitnessLevel: string;
  ageRange: string;
  weightRange: string;
  heightRange: string;
  daysPerWeek: number;
  durationMinutes: number;
  equipment: string[];
  wantsCardio: string;
  cardioTypes: string[];
  injuries: string[];
  healthConditions: string[];
  focusMuscles: string[];
};

const QUESTIONS = [
  {
    key: 'goal' as const,
    question: 'Qual é o seu principal objetivo de treino?',
    type: 'single' as const,
    options: [
      { value: 'hypertrophy', label: 'Hipertrofia' },
      { value: 'weight_loss', label: 'Perda de Peso' },
      { value: 'strength', label: 'Força' },
      { value: 'endurance', label: 'Resistência' },
      { value: 'general_fitness', label: 'Condicionamento Geral' },
    ],
  },
  {
    key: 'fitnessLevel' as const,
    question: 'Qual é o seu nível de condicionamento?',
    type: 'single' as const,
    options: [
      { value: 'beginner', label: 'Iniciante' },
      { value: 'intermediate', label: 'Intermediário' },
      { value: 'advanced', label: 'Avançado' },
    ],
  },
  {
    key: 'ageRange' as const,
    question: 'Qual é a sua faixa etária?',
    type: 'single' as const,
    options: [
      { value: 'under_18', label: 'Menos de 18' },
      { value: '18_25', label: '18 – 25' },
      { value: '26_35', label: '26 – 35' },
      { value: '36_45', label: '36 – 45' },
      { value: '46_55', label: '46 – 55' },
      { value: 'over_55', label: 'Acima de 55' },
    ],
  },
  {
    key: 'weightRange' as const,
    question: 'Qual é o seu peso aproximado?',
    type: 'single' as const,
    options: [
      { value: 'under_60', label: 'Menos de 60 kg' },
      { value: '60_75', label: '60 – 75 kg' },
      { value: '76_90', label: '76 – 90 kg' },
      { value: '91_110', label: '91 – 110 kg' },
      { value: 'over_110', label: 'Acima de 110 kg' },
    ],
  },
  {
    key: 'heightRange' as const,
    question: 'Qual é a sua altura aproximada?',
    type: 'single' as const,
    options: [
      { value: 'under_155', label: 'Menos de 155 cm' },
      { value: '155_165', label: '155 – 165 cm' },
      { value: '166_175', label: '166 – 175 cm' },
      { value: '176_185', label: '176 – 185 cm' },
      { value: 'over_185', label: 'Acima de 185 cm' },
    ],
  },
  {
    key: 'daysPerWeek' as const,
    question: 'Quantos dias por semana você pode treinar?',
    type: 'single' as const,
    options: [
      { value: 2, label: '2 dias' },
      { value: 3, label: '3 dias' },
      { value: 4, label: '4 dias' },
      { value: 5, label: '5 dias' },
      { value: 6, label: '6 dias' },
    ],
  },
  {
    key: 'durationMinutes' as const,
    question: 'Qual é a duração de cada sessão?',
    type: 'single' as const,
    options: [
      { value: 30, label: '30 min' },
      { value: 45, label: '45 min' },
      { value: 60, label: '60 min' },
      { value: 90, label: '90 min' },
    ],
  },
  {
    key: 'equipment' as const,
    question: 'Qual equipamento você tem disponível?',
    type: 'multi' as const,
    options: [
      { value: 'barbell', label: 'Barra' },
      { value: 'dumbbell', label: 'Halteres' },
      { value: 'cable', label: 'Cabo' },
      { value: 'bench', label: 'Banco' },
      { value: 'machine', label: 'Máquina' },
      { value: 'kettlebell', label: 'Kettlebell' },
      { value: 'resistance_bands', label: 'Elásticos' },
      { value: 'bodyweight_only', label: 'Peso Corporal' },
    ],
  },
  {
    key: 'wantsCardio' as const,
    question: 'Você quer incluir cardio no seu treino?',
    type: 'single' as const,
    options: [
      { value: 'yes', label: 'Sim' },
      { value: 'no', label: 'Não' },
    ],
  },
  {
    key: 'cardioTypes' as const,
    question: 'Qual tipo de cardio você prefere?',
    type: 'multi' as const,
    options: [
      { value: 'running', label: 'Corrida' },
      { value: 'cycling', label: 'Bicicleta' },
      { value: 'swimming', label: 'Natação' },
      { value: 'hiit', label: 'HIIT' },
      { value: 'jump_rope', label: 'Corda' },
      { value: 'elliptical', label: 'Elíptico' },
      { value: 'walking', label: 'Caminhada' },
    ],
  },
  {
    key: 'injuries' as const,
    question: 'Tem alguma lesão ou limitação física?',
    type: 'multi' as const,
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'lower_back_pain', label: 'Lombar' },
      { value: 'knee_pain', label: 'Joelho' },
      { value: 'shoulder_pain', label: 'Ombro' },
      { value: 'hip_pain', label: 'Quadril' },
      { value: 'neck_pain', label: 'Pescoço' },
    ],
  },
  {
    key: 'healthConditions' as const,
    question: 'Possui alguma condição de saúde?',
    type: 'multi' as const,
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'diabetes', label: 'Diabetes' },
      { value: 'hypertension', label: 'Hipertensão' },
      { value: 'heart_condition', label: 'Problemas Cardíacos' },
      { value: 'asthma', label: 'Asma' },
      { value: 'osteoporosis', label: 'Osteoporose' },
      { value: 'obesity', label: 'Obesidade' },
    ],
  },
  {
    key: 'focusMuscles' as const,
    question: 'Quais grupos musculares você quer focar?',
    type: 'multi' as const,
    options: [
      { value: 'chest', label: 'Peito' },
      { value: 'upper_back', label: 'Costas Superiores' },
      { value: 'lower_back', label: 'Lombar' },
      { value: 'shoulders', label: 'Ombros' },
      { value: 'biceps', label: 'Bíceps' },
      { value: 'triceps', label: 'Tríceps' },
      { value: 'legs', label: 'Pernas' },
      { value: 'glutes', label: 'Glúteos' },
      { value: 'core', label: 'Core' },
    ],
  },
];

const INITIAL_ANSWERS: Answers = {
  goal: '',
  fitnessLevel: '',
  ageRange: '',
  weightRange: '',
  heightRange: '',
  daysPerWeek: 0,
  durationMinutes: 0,
  equipment: [],
  wantsCardio: '',
  cardioTypes: [],
  injuries: [],
  healthConditions: [],
  focusMuscles: [],
};

export default function OnboardingFlow({ userId, userName, onComplete }: OnboardingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const current = QUESTIONS[step];

  // Visible steps: skip cardioTypes if user doesn't want cardio
  function getVisibleSteps(): number[] {
    return QUESTIONS.reduce<number[]>((acc, q, i) => {
      if (q.key === 'cardioTypes' && answers.wantsCardio !== 'yes') return acc;
      acc.push(i);
      return acc;
    }, []);
  }

  const visibleSteps = getVisibleSteps();
  const visibleIndex = visibleSteps.indexOf(step);
  const totalVisible = visibleSteps.length;
  const progress = ((visibleIndex + 1) / totalVisible) * 100;
  const isLast = visibleIndex === totalVisible - 1;

  function isSelected(value: string | number): boolean {
    const key = current.key;
    if (current.type === 'single') return answers[key] === value;
    return (answers[key] as string[]).includes(String(value));
  }

  function canAdvance(): boolean {
    const key = current.key;
    if (current.type === 'single') return !!answers[key];
    return (answers[key] as string[]).length > 0;
  }

  function handleSelect(value: string | number) {
    const key = current.key;
    if (current.type === 'single') {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    } else {
      const strVal = String(value);
      const arr = answers[key] as string[];
      setAnswers((prev) => ({
        ...prev,
        [key]: arr.includes(strVal) ? arr.filter((v) => v !== strVal) : [...arr, strVal],
      }));
    }
  }

  function handleNext() {
    const next = visibleSteps[visibleIndex + 1];
    if (next !== undefined) setStep(next);
  }

  function handleBack() {
    const prev = visibleSteps[visibleIndex - 1];
    if (prev !== undefined) setStep(prev);
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError('');
    try {
      await updateGymProfile(userId, answers as unknown as Record<string, unknown>);
      generateWorkout(userId); // Gera o treino imediatamente após salvar o perfil
      if (onComplete) onComplete();
      else router.refresh();
    } catch {
      setError('Algo deu errado. Tente novamente.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
            <Dumbbell className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-sm font-semibold tracking-tight">GymAI</span>
        </div>
        <span className="text-xs text-zinc-600 font-medium tabular-nums">
          {visibleIndex + 1} / {totalVisible}
        </span>
      </header>

      {/* Barra de progresso */}
      <div className="h-px bg-zinc-900">
        <div
          className="h-px bg-white transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Pergunta */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <p className="text-xs text-zinc-600 uppercase tracking-widest font-medium text-center mb-3">
            Etapa {visibleIndex + 1}
          </p>
          <h2 className="text-xl font-semibold text-white mb-8 text-center leading-snug">
            {current.question}
          </h2>

          <div className="flex flex-wrap gap-2.5 justify-center mb-10">
            {current.options.map((opt) => (
              <button
                key={String(opt.value)}
                onClick={() => handleSelect(opt.value)}
                className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-all min-h-[44px] ${
                  isSelected(opt.value)
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-zinc-400 border-white/[0.12] hover:border-white/30 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center mb-6">{error}</p>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={visibleIndex === 0}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors min-h-[44px] px-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={!canAdvance() || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                <Check className="w-4 h-4" />
                {isSubmitting ? 'Salvando...' : 'Criar Meu Treino'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canAdvance()}
                className="px-6 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-100 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                Próximo
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <div className="px-6 py-4 border-t border-white/[0.06]">
        <p className="text-xs text-zinc-700 text-center">Configurando plano para {userName}</p>
      </div>
    </div>
  );
}
