type UserProps = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
};

export class User {
   constructor(private props: UserProps) {}

  static create(props:UserProps): User {
    return new User(props);
  }

  static from(input: UserProps): User {
    return new User(input );
  }

  get id() {
    return this.props.id;
  }

  get email() {
    return this.props.email;
  }

  get firstName() {
    return this.props.firstName;
  }

  get lastName() {
    return this.props.lastName;
  }

  get phone() {
    return this.props.phone;    
  }

}