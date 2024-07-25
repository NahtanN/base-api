import UserEntity from "../entity/user.entity";

export interface UserServiceInterface {
  findById(id: string): Promise<UserEntity>;
}
