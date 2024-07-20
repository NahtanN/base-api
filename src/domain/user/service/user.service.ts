import AppError from "@shared/errors";
import UserEntity from "../entity/user.entity";
import UserRepositoryInterface from "../repository/user_repository.interface";
import { UserServiceInterface } from "./user_service.interface";

export class UserService implements UserServiceInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async findById(id: string): Promise<UserEntity> {
    let user: UserEntity | null;
    try {
      user = await this.userRepository.findById(id);
    } catch (error) {
      throw AppError.internalServerError("Erro ao procurar o usuário.");
    }
    if (!user) {
      throw AppError.notFound("Usuário não encontrado.");
    }

    return user;
  }
}
