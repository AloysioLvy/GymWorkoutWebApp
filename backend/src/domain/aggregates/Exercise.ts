type ExerciseProps = {
  id: string;
  name: string;
  gifUrl: string | null;
  targetMuscles: string | null;
  bodyParts: string | null;
  equipments: string | null;
  secondaryMuscles: string | null;
  instructions: string | null;
  cachedAt: Date | null;
};

export class Exercise {
  constructor(private props: ExerciseProps) {}

  static create(props: ExerciseProps): Exercise {
    return new Exercise(props);
  }

  static from(input: ExerciseProps): Exercise {
    return new Exercise(input);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get gifUrl() { return this.props.gifUrl; }
  get targetMuscles() { return this.props.targetMuscles; }
  get bodyParts() { return this.props.bodyParts; }
  get equipments() { return this.props.equipments; }
  get secondaryMuscles() { return this.props.secondaryMuscles; }
  get instructions() { return this.props.instructions; }
  get cachedAt() { return this.props.cachedAt; }
}
