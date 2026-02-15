import type { GymProfile } from "../../../domain/aggregates/GymProfile";

export type GymProfileResponseDto = {
  id: string;
  userId: string;
  answers: unknown;
  updatedAt: Date;
};

export class GymProfileResponseMapper {
  static toResponse(gymProfile: GymProfile): GymProfileResponseDto {
    return {
      id: gymProfile.id,
      userId: gymProfile.userId,
      answers: gymProfile.answers,
      updatedAt: gymProfile.updatedAt,
   
    };
  }
}
