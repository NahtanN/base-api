import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "./providers/loggers/winston/winstons.module";
import PgModule from "./providers/database/pg/pg.module";
import { AuthenticationModule } from "./modules/authentication/authentication.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    WinstonModule,
    PgModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
