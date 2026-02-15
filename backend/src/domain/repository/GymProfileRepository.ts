import { GymProfile } from "../aggregates/GymProfile";

export interface GymProfileRepository {
  create(gymProfile: GymProfile): Promise<GymProfile>;
  findByUserId(userId: string): Promise<GymProfile | null>;
  findById(id: string): Promise<GymProfile | null>;
  update(gymProfile: GymProfile): Promise<GymProfile>;
}