import { inject, injectable } from "inversify";
import { TYPES } from "../dto/types";
import { GymProfileRepository } from "../../domain/repository/GymProfileRepository";
import { UpdateGymProfileDto } from "../dto/input/UpdateGymProfile";
import { GymProfile } from "../../domain/aggregates/GymProfile";
import { GymProfileResponseMapper, type GymProfileResponseDto } from "../dto/output/GymProfileResponseDto";

@injectable()
export class UpdateGymProfileUseCase {

    constructor(
        @inject(TYPES.GymProfileRepository) private readonly gymProfileRepository: GymProfileRepository,
    ) {}

  async execute(input:UpdateGymProfileDto): Promise<GymProfileResponseDto> {

    const existingGymProfile = await this.gymProfileRepository.findByUserId(input.userId);
    if (!existingGymProfile) {

        const newGymProfile = GymProfile.create({
            id: crypto.randomUUID(),
            userId: input.userId,
            answers: input.answers,
            updatedAt: new Date(),
        });

        await this.gymProfileRepository.create(newGymProfile);
        return GymProfileResponseMapper.toResponse(newGymProfile);
    }

    const updatedGymProfile = existingGymProfile.updateAnswers(input.answers);
    await this.gymProfileRepository.update(updatedGymProfile);
    return GymProfileResponseMapper.toResponse(updatedGymProfile);
  }
}