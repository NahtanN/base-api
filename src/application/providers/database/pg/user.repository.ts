import UserPgRepository from "@infrastructure/database/repositories/pg/user.pg";
import WinstonLogger from "@infrastructure/logger/winston/winston.logger";
import { Inject, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { PG_CONNECTION } from "src/application/constants";
import WinstonService from "../../loggers/winston/winston.service";

@Injectable()
export default class UserRepository extends UserPgRepository {
  constructor(
    logger: WinstonService,
    @Inject(PG_CONNECTION)
    conn: PoolClient,
  ) {
    super(logger, conn);
  }
}
