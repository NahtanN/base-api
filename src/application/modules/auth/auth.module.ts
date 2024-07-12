import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";
import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AuthService from "src/domain/auth/service/auth.service";
import AppAuthService from "./auth.service";
import PgModule from "src/application/providers/database/pg/pg.module";

@Module({
  imports: [PgModule],
  controllers: [AuthController],
  providers: [
    {
      provide: "AuthServiceInterface",
      useClass: AppAuthService,
    },
  ],
})
export class AuthModule { }
