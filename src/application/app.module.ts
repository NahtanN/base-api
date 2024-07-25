import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "./providers/loggers/winston/winstons.module";
import PgModule from "./providers/database/pg/pg.module";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import HttpExceptionFilter from "./filters/exception.filter";
import { AuthenticationGuard } from "./guards/authentication.guard";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule,
    PgModule,
    AuthenticationModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
  ],
})
export class AppModule { }
