export default class EntityParams {
  constructor(
    private createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date,
  ) { }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }

  getDeletedAt() {
    return this.deletedAt;
  }
}
