export interface ExerciseTranslatorProvider {
  translateQueryToEnglish(query: string): Promise<string>;
  translateNames(names: string[]): Promise<string[]>;
  translateInstructions(instructions: string[]): Promise<string[]>;
}
