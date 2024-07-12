import { Injectable } from "@nestjs/common";
import UserRepository from "src/application/providers/database/pg/user.repository";
import WinstonService from "src/application/providers/loggers/winston/winston.service";
import AuthService from "src/domain/auth/service/auth.service";

@Injectable()
export default class AppAuthService extends AuthService {
  constructor(logger: WinstonService, userRepository: UserRepository) {
    super(logger, userRepository);
  }
}
