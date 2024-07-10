import { Controller, Get, Inject, Post } from "@nestjs/common";
import AuthServiceInterface from "src/domain/auth/service/auth_service.interface";
import SignInResponseInterface from "src/domain/auth/service/dtos/response/sign_in.response";
import SignUpResponseInterface from "src/domain/auth/service/dtos/response/sign_up.response";
import LoggerInterface from "src/infrastructure/logger/logger.interface";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AuthServiceInterface")
    private readonly service: AuthServiceInterface,
  ) { }

  @Post("/sign-up")
  signUp(): SignUpResponseInterface {
    return this.service.signUp();
  }

  @Post("/sign-in")
  signIn(): SignInResponseInterface {
    return this.service.signIn();
  }
}
