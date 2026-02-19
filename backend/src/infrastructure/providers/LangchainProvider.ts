import { injectable } from "inversify";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { GymProfile } from "../../domain/aggregates/GymProfile";
import { WorkoutAgentProvider } from "../../application/provider/WorkoutAgentProvider";

const workoutOutputSchema = z.object({
  name: z.string().describe("Nome do plano de treino em português"),
  days: z.array(
    z.object({
      day: z.string().describe("Dia da semana ou rótulo da sessão em português (ex: Segunda-feira, Dia 1)"),
      focus: z.string().describe("Grupo muscular ou foco do treino em português (ex: Peito e Tríceps)"),
      exercises: z.array(
        z.object({
          name: z.string().describe("Nome do exercício em português"),
          sets: z.number().describe("Número de séries"),
          reps: z.string().describe("Número de repetições ou duração em português (ex: 12 repetições, 30 segundos)"),
          rest: z.string().describe("Tempo de descanso entre as séries em português (ex: 60 segundos)"),
          notes: z.string().optional().describe("Observações opcionais sobre a técnica em português"),
        })
      ),
    })
  ),
});

@injectable()
export class LangchainWorkoutAgentProvider implements WorkoutAgentProvider {
  private model: ChatOpenAI;
  private parser: StructuredOutputParser<typeof workoutOutputSchema>;

  constructor() {
    this.model = new ChatOpenAI({
      modelName: "gpt-4o",
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.4,
    });

    this.parser = StructuredOutputParser.fromZodSchema(workoutOutputSchema);
  }

  async generateWorkoutPlan(gymProfile: GymProfile): Promise<string> {
    const formatInstructions = this.parser.getFormatInstructions();

    const prompt = PromptTemplate.fromTemplate(
      `Você é um personal trainer especialista. Com base nas seguintes respostas do perfil de academia, crie um plano de treino semanal personalizado.

IMPORTANTE: Responda INTEIRAMENTE em português brasileiro. Todos os campos de texto — nome do plano, dias, foco muscular, nomes dos exercícios, repetições, descanso e observações — devem estar em português.

REGRAS PARA NOMES DE EXERCÍCIOS:
- Use nomes canônicos e amplamente reconhecidos em português (ex: "Supino Reto", "Agachamento", "Rosca Direta").
- Evite variações criativas ou abreviações pouco comuns.
- Prefira termos consistentes entre sessões do mesmo plano.
- Não inclua o número de séries ou repetições no nome do exercício.

Respostas do Perfil de Academia:
{answers}

Gere um plano de treino completo e estruturado, adaptado ao nível de condicionamento físico do usuário, seus objetivos e aos equipamentos disponíveis.
Inclua nomes dos exercícios em português, número de séries, repetições, tempos de descanso e observações relevantes sobre a técnica quando necessário.

{format_instructions}`
    );

    const chain = prompt.pipe(this.model).pipe(this.parser);

    const result = await chain.invoke({
      answers: JSON.stringify(gymProfile.answers, null, 2),
      format_instructions: formatInstructions,
    });

    return JSON.stringify(result);
  }
}
