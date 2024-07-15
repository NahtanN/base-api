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
import { AuthorizationFeatures } from "@domain/authorization/authorization_features.types";
import UserEntity from "@domain/user/entity/user.entity";

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

    // TODO: validate password strength
    const encodedPassword = this.hashPassword(dto.password);

    const user: UserEntity = await this.userRepository.create(
      dto.name,
      dto.email,
      `${encodedPassword.salt}.${encodedPassword.hash}`,
      [
        AuthorizationFeatures.CREATE_TOKEN,
        AuthorizationFeatures.READ_TOKEN,
        AuthorizationFeatures.READ_USER_OWN,
        AuthorizationFeatures.CREATE_SERVICE_PROVIDER,
      ],
    );

    const accessToken = this.createJwtToken({
      id: user.userId,
    });

    return {
      message: "Usuário cadastrado com sucesso.",
      accessToken,
    };
  }

  async signIn(dto: SignInRequest): Promise<SignInResponseInterface> {
    let user: UserEntity | null;
    try {
      user = await this.userRepository.findByEmail(dto.login);
    } catch (error) {
      throw AppError.internalServerError(
        "Não foi possível procurar o usuário.",
      );
    }
    if (!user) {
      throw AppError.badRequest("Usuário ou senha inválidos.");
    }

    const hasFeature = user.features.includes(
      AuthorizationFeatures.CREATE_TOKEN,
    );
    if (!hasFeature) {
      throw AppError.unauthorized("Usuário não possui autorização.");
    }

    const isValid = this.validatePassword(dto.password, user.password);
    if (!isValid) {
      throw AppError.badRequest("Usuário ou senha inválidos.");
    }

    const accessToken = this.createJwtToken({
      id: user.userId,
    });

    return {
      accessToken,
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

  validatePassword(password: string, hashedPassword: string) {
    const [salt, hash] = hashedPassword.split(".");

    const hashVerify = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
      "hex",
    );

    return hash === hashVerify;
  }
}
