import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";
import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AuthService from "src/domain/auth/service/auth.service";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: "AuthServiceInterface",
      useFactory: (logger: LoggerInterface) => {
        return new AuthService(logger);
      },
      inject: [WinstonLogger],
    },
    WinstonLogger,
  ],
})
export class AuthModule { }
