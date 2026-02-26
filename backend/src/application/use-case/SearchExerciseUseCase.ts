import { injectable, inject } from 'inversify';
import pLimit from 'p-limit';
import { ExerciseRepository } from '../../domain/repository/ExerciseRepository';
import { Exercise } from '../../domain/aggregates/Exercise';
import { ExerciseResponseMapper, type SearchExerciseResult } from '../dto/output/ExerciseResponseDto';
import type { ExerciseTranslatorProvider } from '../provider/ExerciseTranslatorProvider';
import { TYPES } from '../dto/types';

// Módulo-level: limita concorrência total de chamadas ao OpenAI entre todas as requisições simultâneas
const gptLimit = pLimit(3);

interface ExerciseDbExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

const EXERCISEDB_SEARCH_URL =
  process.env.EXERCISEDB_API_URL ?? 'https://exercisedb.dev/api/v1/exercises/search';

@injectable()
export class SearchExerciseUseCase {
  constructor(
    @inject(TYPES.ExerciseRepository) private readonly exerciseRepository: ExerciseRepository,
    @inject(TYPES.ExerciseTranslatorProvider) private readonly translator: ExerciseTranslatorProvider,
  ) {}

  async execute(query: string): Promise<SearchExerciseResult> {
    // 1. Try cache with original query (hits after PT names are stored)
    const cachedByQuery = await this.exerciseRepository.findByName(query);
    if (cachedByQuery.length > 0) {
      return { results: cachedByQuery.map(ExerciseResponseMapper.toResponse), translatedTerm: query };
    }

    // 2. Translate to English and try cache again (fallback for EN-named exercises)
    const translatedTerm = await this.translator.translateQueryToEnglish(query);
    const cachedByEn = await this.exerciseRepository.findByName(translatedTerm);
    if (cachedByEn.length > 0) {
      return { results: cachedByEn.map(ExerciseResponseMapper.toResponse), translatedTerm };
    }

    // 3. Fetch from ExerciseDB API
    const rawExercises = await this.fetchFromApi(translatedTerm);
    if (rawExercises.length === 0) {
      return { results: [], translatedTerm };
    }

    // 4. Batch translate: names (1 call) and instructions (max 3 concurrent via gptLimit)
    const [namesPt, instructionsPtList] = await Promise.all([
      gptLimit(() => this.translator.translateNames(rawExercises.map((e) => e.name))),
      Promise.all(rawExercises.map((e) =>
        gptLimit(() => this.translator.translateInstructions(e.instructions ?? []))
      )),
    ]);

    const exercises = rawExercises.map((e, i) =>
      Exercise.from({
        id: e.exerciseId,
        name: namesPt[i],
        gifUrl: e.gifUrl ?? null,
        targetMuscles: JSON.stringify(e.targetMuscles ?? []),
        bodyParts: JSON.stringify(e.bodyParts ?? []),
        equipments: JSON.stringify(e.equipments ?? []),
        secondaryMuscles: JSON.stringify(e.secondaryMuscles ?? []),
        instructions: JSON.stringify(instructionsPtList[i]),
        cachedAt: new Date(),
      })
    );

    await this.exerciseRepository.upsertMany(exercises);

    return { results: exercises.map(ExerciseResponseMapper.toResponse), translatedTerm };
  }

  private async fetchFromApi(term: string): Promise<ExerciseDbExercise[]> {
    const url = `${EXERCISEDB_SEARCH_URL}?q=${encodeURIComponent(term)}&limit=20`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data ?? []);
  }
}
