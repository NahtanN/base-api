import EntityParams from "@domain/@shared/entity_params.interface";

export default class UserEntity extends EntityParams {
  constructor(
    private _id: number,
    private _userId: string,
    private _name: string,
    private _email: string,
    private _emailAuthenticated: boolean,
    private _password: string,
    private _features: string[],
    private _acceptedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    super(createdAt, updatedAt, deletedAt);
    this.validate();
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get emailAuthenticated() {
    return this._emailAuthenticated;
  }

  get password() {
    return this._password;
  }

  get features() {
    return this._features;
  }

  get acceptedAt() {
    return this._acceptedAt;
  }

  validate() {
    console.log(this);
    console.log("Validate");
  }
}
