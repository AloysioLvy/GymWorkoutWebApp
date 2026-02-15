type GymProfileProps = {
  id: string;
  userId: string;
  answers: any[];
  updatedAt: Date;
};

export class GymProfile {
   constructor(private props: GymProfileProps) {}
  static create(props:GymProfileProps): GymProfile {
    return new GymProfile(props);
  }

  static from(input: GymProfileProps): GymProfile {
    return new GymProfile(input );
  }

  get id() {
    return this.props.id;
  }

  get userId() {
    return this.props.userId;
  }

  get answers() {
    return this.props.answers;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }
}