type WorkoutProps = {
  id: string;
  name: string;
  userId: string;
  status: string;
  aiOutput: unknown;
  createdAt: Date;
  updatedAt: Date;
};

export class Workout {
  constructor(private props: WorkoutProps) {}

  static create(props: WorkoutProps): Workout {
    return new Workout(props);
  }

  static from(props: WorkoutProps): Workout {
    return new Workout(props);
  }

  get id() { return this.props.id; }
  get name() { return this.props.name; }
  get userId() { return this.props.userId; }
  get status() { return this.props.status; }
  get aiOutput() { return this.props.aiOutput; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
}
