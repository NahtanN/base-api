import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AuthServiceInterface from "./auth_service.interface";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";

export default class AuthService implements AuthServiceInterface {
  constructor(private readonly logger: LoggerInterface) { }

  signUp(): SignUpResponseInterface {
    this.logger.warning("test warning");

    return {
      message: "Usuário cadastrado com sucesso.",
      accessToken: "asdf",
    };
  }

  signIn(): SignInResponseInterface {
    this.logger.info("test info");
    this.logger.error("test error");

    return {
      accessToken: "asf",
    };
  }
}
