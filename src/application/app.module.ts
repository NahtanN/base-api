import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { WinstonModule } from "./providers/loggers/winston/winstons.module";
import PgModule from "./providers/database/pg/pg.module";

@Module({
  imports: [ConfigModule.forRoot(), WinstonModule, PgModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
