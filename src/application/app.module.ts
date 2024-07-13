import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "./providers/loggers/winston/winstons.module";
import PgModule from "./providers/database/pg/pg.module";
import { AuthenticationModule } from "./modules/authentication/authentication.module";
import { APP_FILTER } from "@nestjs/core";
import HttpExceptionFilter from "./filters/exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule,
    PgModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
