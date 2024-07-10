import { Injectable } from "@nestjs/common";
import AuthService from "src/domain/auth/service/auth.service";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";

@Injectable()
export default class AppAuthService extends AuthService {
  constructor(logger: WinstonLogger) {
    super(logger);
  }
}
