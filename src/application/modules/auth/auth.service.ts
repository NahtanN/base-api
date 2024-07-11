import { Injectable } from "@nestjs/common";
import WinstonService from "src/application/providers/loggers/winston/winston.service";
import AuthService from "src/domain/auth/service/auth.service";

@Injectable()
export default class AppAuthService extends AuthService {
  constructor(logger: WinstonService) {
    super(logger);
  }
}
