import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AuthServiceInterface from "./auth_service.interface";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import { SignInRequest } from "./dtos/request/sign_in.request";

export default class AuthService implements AuthServiceInterface {
  constructor(private readonly logger: LoggerInterface) {}

  signUp(dto: SignUpRequest): SignUpResponseInterface {
    this.logger.warning("test warning", dto);

    return {
      message: "Usuário cadastrado com sucesso.",
      accessToken: "asdf",
    };
  }

  signIn(dto: SignInRequest): SignInResponseInterface {
    this.logger.info("test info");
    this.logger.error("test error");

    return {
      accessToken: "asf",
    };
  }
}
