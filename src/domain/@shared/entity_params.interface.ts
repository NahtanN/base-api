export default class EntityParams {
  constructor(
    private _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date,
  ) { }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  get deletedAt() {
    return this._deletedAt;
  }
}
