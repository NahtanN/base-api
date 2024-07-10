import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";
import LoggerInterface from "src/infrastructure/logger/logger.interface";

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: "LoggerInterface",
      useClass: WinstonLogger,
    },
  ],
})
export class AuthModule { }
