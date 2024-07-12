import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AuthServiceInterface from "./auth_service.interface";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import { SignInRequest } from "./dtos/request/sign_in.request";
import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import AppError from "@shared/errors";

export default class AuthService implements AuthServiceInterface {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  async signUp(dto: SignUpRequest): Promise<SignUpResponseInterface> {
    // TODO: validate if user already exists on database
    const userExists = await this.userRepository.existsByEmail(dto.email);
    if (userExists) {
      throw AppError.unauthorized("Email já está em uso.");
    }
    // TODO: encode password
    // TODO: set user features
    // TODO: save new user

    // TODO: create accessToken
    // TODO: return data
    return {
      message: "Usuário cadastrado com sucesso.",
      accessToken: "asdf",
    };
  }

  signIn(dto: SignInRequest): SignInResponseInterface {
    // TODO: validate if user exists
    // TODO: validate if user has feature
    // TODO: validate password
    // TODO: create accessToken
    return {
      accessToken: "asf",
    };
  }
}
