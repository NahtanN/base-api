import LoggerInterface from "src/infrastructure/logger/logger.interface";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import { SignInRequest } from "./dtos/request/sign_in.request";
import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import AppError from "@shared/errors";
import JwtServiceInterface from "@infrastructure/jwt_service/jwt_service.interface";
import { pbkdf2Sync, randomBytes } from "crypto";
import AuthenticationServiceInterface from "./authentication_service.interface";

export default class AuthenticationService
  implements AuthenticationServiceInterface {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly jwtService: JwtServiceInterface,
    private readonly userRepository: UserRepositoryInterface,
  ) { }

  async signUp(dto: SignUpRequest): Promise<SignUpResponseInterface> {
    const userExists = await this.userRepository.existsByEmail(dto.email);
    if (userExists) {
      throw AppError.unauthorized("Email já está em uso.");
    }

    const encodedPassword = this.hashPassword(dto.password);

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

  createJwtToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }

  hashPassword(password: string): {
    salt: string;
    hash: string;
  } {
    const salt = randomBytes(32).toString("hex");
    const genHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
      "hex",
    );

    return {
      salt: salt,
      hash: genHash,
    };
  }
}
