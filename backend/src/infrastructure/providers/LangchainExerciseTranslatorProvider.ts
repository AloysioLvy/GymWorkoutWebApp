import { injectable } from 'inversify';
import { ChatOpenAI } from '@langchain/openai';
import type { ExerciseTranslatorProvider } from '../../application/provider/ExerciseTranslatorProvider';

@injectable()
export class LangchainExerciseTranslatorProvider implements ExerciseTranslatorProvider {
  private readonly model: ChatOpenAI;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });
  }

  async translateQueryToEnglish(query: string): Promise<string> {
    const response = await this.model.invoke([
      {
        role: 'system',
        content:
          'You are a fitness translator. Translate the given Portuguese exercise or muscle group name to English. Return ONLY the translated term, nothing else. If the input is already in English, return it as-is.',
      },
      { role: 'user', content: query },
    ]);
    return (response.content as string).trim();
  }

  async translateNames(names: string[]): Promise<string[]> {
    if (names.length === 0) return [];

    const response = await this.model.invoke([
      {
        role: 'system',
        content:
          'You are a fitness translator. Translate the following exercise names from English to Brazilian Portuguese. Use well-known gym terminology (e.g. "Barbell Bench Press" → "Supino com Barra"). Return ONLY a valid JSON array of strings in the same order, nothing else.',
      },
      { role: 'user', content: JSON.stringify(names) },
    ]);

    try {
      const translated = JSON.parse(response.content as string);
      return Array.isArray(translated) && translated.length === names.length
        ? translated
        : names;
    } catch {
      return names;
    }
  }

  async translateInstructions(instructions: string[]): Promise<string[]> {
    if (instructions.length === 0) return [];

    const response = await this.model.invoke([
      {
        role: 'system',
        content:
          'You are a fitness translator. Translate the following exercise instructions from English to Brazilian Portuguese. Return ONLY a valid JSON array of strings with the translated instructions in the same order. Keep technical terms accurate.',
      },
      { role: 'user', content: JSON.stringify(instructions) },
    ]);

    try {
      const translated = JSON.parse(response.content as string);
      return Array.isArray(translated) ? translated : instructions;
    } catch {
      return instructions;
    }
  }
}
