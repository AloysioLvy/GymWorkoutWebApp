import type { Exercise } from '../../../domain/aggregates/Exercise';

export type ExerciseResponseDto = {
  id: string;
  name: string;
  gifUrl: string | null;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
};

export type SearchExerciseResult = {
  results: ExerciseResponseDto[];
  translatedTerm: string;
};

const EXERCISE_TERMS_PT: Record<string, string> = {
  // Body parts
  chest: 'peito',
  back: 'costas',
  shoulders: 'ombros',
  'upper arms': 'braços superiores',
  'lower arms': 'antebraços',
  'upper legs': 'coxas',
  'lower legs': 'panturrilhas',
  waist: 'abdômen',
  cardio: 'cardio',
  neck: 'pescoço',
  // Muscles
  pectorals: 'peitoral',
  lats: 'latíssimo',
  delts: 'deltoides',
  deltoids: 'deltoides',
  biceps: 'bíceps',
  triceps: 'tríceps',
  abs: 'abdominais',
  quads: 'quadríceps',
  hamstrings: 'isquiotibiais',
  glutes: 'glúteos',
  calves: 'panturrilhas',
  traps: 'trapézio',
  'serratus anterior': 'serrátil anterior',
  spine: 'coluna',
  'cardiovascular system': 'sistema cardiovascular',
  'upper back': 'parte superior das costas',
  forearms: 'antebraços',
  'levator scapulae': 'elevador da escápula',
  'adductor magnus': 'adutor magno',
  adductors: 'adutores',
  obliques: 'oblíquos',
  'hip flexors': 'flexores do quadril',
  // Equipment
  barbell: 'barra',
  dumbbell: 'halteres',
  cable: 'cabo / polia',
  'body weight': 'peso corporal',
  machine: 'máquina',
  band: 'elástico',
  kettlebell: 'kettlebell',
  'sled machine': 'trenó',
  'smith machine': 'smith machine',
  'ez barbell': 'barra EZ',
  'trap bar': 'barra hexagonal',
  'stability ball': 'bola de estabilidade',
  'bosu ball': 'bosu',
  rope: 'corda',
  'leverage machine': 'máquina de alavanca',
  assisted: 'assistido',
  roller: 'rolo',
  'resistance band': 'faixa elástica',
};

function translateTerm(term: string): string {
  return EXERCISE_TERMS_PT[term.toLowerCase()] ?? term;
}

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try { return JSON.parse(value); } catch { return [value]; }
}

export class ExerciseResponseMapper {
  static toResponse(exercise: Exercise): ExerciseResponseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      gifUrl: exercise.gifUrl,
      targetMuscles: parseJsonArray(exercise.targetMuscles).map(translateTerm),
      bodyParts: parseJsonArray(exercise.bodyParts).map(translateTerm),
      equipments: parseJsonArray(exercise.equipments).map(translateTerm),
      secondaryMuscles: parseJsonArray(exercise.secondaryMuscles).map(translateTerm),
      instructions: parseJsonArray(exercise.instructions),
    };
  }
}
