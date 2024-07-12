import UserPgRepository from "@infrastructure/database/repositories/pg/user.pg";
import { Inject, Injectable } from "@nestjs/common";
import { PoolClient } from "pg";
import { PG_CONNECTION } from "src/application/constants";

@Injectable()
export default class UserRepository extends UserPgRepository {
  constructor(
    @Inject(PG_CONNECTION)
    readonly conn: PoolClient,
  ) {
    super(conn);
  }
}
