import { Global, Module } from "@nestjs/common";
import { AuthenticationController } from "./authentication.controller";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";
import LoggerInterface from "src/infrastructure/logger/logger.interface";
import AppAuthService from "./authentication.service";
import PgModule from "src/application/providers/database/pg/pg.module";
import AppAuthenticationService from "./authentication.service";
import { JwtModule } from "@nestjs/jwt";

@Global()
@Module({
  imports: [
    PgModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: "1d",
        algorithm: "HS384",
      },
      verifyOptions: {
        algorithms: ["HS384"],
      },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: "AuthenticationServiceInterface",
      useClass: AppAuthenticationService,
    },
  ],
})
export class AuthenticationModule { }
