import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SignInDocs, SignUpDocs } from "src/application/docs";
import AuthServiceInterface from "src/domain/auth/service/auth_service.interface";
import { SignInRequest } from "src/domain/auth/service/dtos/request/sign_in.request";
import { SignUpRequest } from "src/domain/auth/service/dtos/request/sign_up.request";
import SignInResponseInterface from "src/domain/auth/service/dtos/response/sign_in.response";
import SignUpResponseInterface from "src/domain/auth/service/dtos/response/sign_up.response";
import LoggerInterface from "src/infrastructure/logger/logger.interface";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("AuthServiceInterface")
    private readonly service: AuthServiceInterface,
  ) { }

  @SignUpDocs()
  @Post("/sign-up")
  signUp(@Body() dto: SignUpRequest): Promise<SignUpResponseInterface> {
    return this.service.signUp(dto);
  }

  @SignInDocs()
  @Post("/sign-in")
  signIn(@Body() dto: SignInRequest): SignInResponseInterface {
    return this.service.signIn(dto);
  }
}
