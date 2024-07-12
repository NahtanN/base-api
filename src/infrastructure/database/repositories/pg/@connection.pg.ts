import { PoolClient } from "pg";

export default interface PgConnection {
  conn: PoolClient;
}
