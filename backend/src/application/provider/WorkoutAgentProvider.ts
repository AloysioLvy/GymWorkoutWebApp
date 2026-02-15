import { GymProfile } from "../../domain/aggregates/GymProfile";

export interface WorkoutAgentProvider {
    generateWorkoutPlan(gymProfile: GymProfile): Promise<string>;
}