import AuthenticationServiceInterface from "@domain/authentication/service/authentication_service.interface";
import { Body, Controller, Get, Inject, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { IsPublic } from "src/application/decorators/is_public.decorator";
import { SignInDocs, SignUpDocs } from "src/application/docs";
import { SignInRequest } from "src/domain/authentication/service/dtos/request/sign_in.request";
import { SignUpRequest } from "src/domain/authentication/service/dtos/request/sign_up.request";
import SignInResponseInterface from "src/domain/authentication/service/dtos/response/sign_in.response";
import SignUpResponseInterface from "src/domain/authentication/service/dtos/response/sign_up.response";
import LoggerInterface from "src/infrastructure/logger/logger.interface";

@ApiTags("authentication")
@Controller("authentication")
export class AuthenticationController {
  constructor(
    @Inject("AuthenticationServiceInterface")
    private readonly service: AuthenticationServiceInterface,
  ) {}

  @SignUpDocs()
  @IsPublic()
  @Post("/sign-up")
  signUp(@Body() dto: SignUpRequest): Promise<SignUpResponseInterface> {
    return this.service.signUp(dto);
  }

  @SignInDocs()
  @IsPublic()
  @Post("/sign-in")
  signIn(@Body() dto: SignInRequest): Promise<SignInResponseInterface> {
    return this.service.signIn(dto);
  }
}
