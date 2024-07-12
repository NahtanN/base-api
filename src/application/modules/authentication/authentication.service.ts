import AuthenticationService from "@domain/authentication/service/authentication.service";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import UserRepository from "src/application/providers/database/pg/user.repository";
import WinstonService from "src/application/providers/loggers/winston/winston.service";

@Injectable()
export default class AppAuthenticationService extends AuthenticationService {
  constructor(
    logger: WinstonService,
    jwtService: JwtService,
    userRepository: UserRepository,
  ) {
    super(logger, jwtService, userRepository);
  }
}
