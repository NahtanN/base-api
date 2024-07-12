import LoggerInterface from "@infrastructure/logger/logger.interface";
import { PoolClient } from "pg";

export default interface PgConnection {
  logger: LoggerInterface;
  conn: PoolClient;
  logSuccess(query: string, ...params: any[]): void;
  logError(query: string, ...params: any[]): void;
}
