import { Global, Module } from "@nestjs/common";
import { AppUserService } from "./user.service";
import PgModule from "src/application/providers/database/pg/pg.module";

@Global()
@Module({
  providers: [AppUserService],
  exports: [AppUserService],
})
export class UserModule {}
