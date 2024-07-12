import LoggerInterface from "@infrastructure/logger/logger.interface";
import { PoolClient } from "pg";

export default interface PgConnection {
  logger: LoggerInterface;
  conn: PoolClient;
}
