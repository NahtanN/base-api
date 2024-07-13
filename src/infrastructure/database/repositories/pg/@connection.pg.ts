import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";
import { PoolClient } from "pg";

export default class PgConnection {
  constructor(
    private logger: LoggerInterface,
    private _conn: PoolClient,
  ) {}

  get conn() {
    return this._conn;
  }

  logSuccess(query: string, ...params: any[]): void {
    this.logger.info("SUCCESS DATABASE QUERY", query, params);
  }

  logError(query: string, ...params: any[]): void {
    this.logger.error("ERROR DATABASE QUERY", query, params);
  }

  async startTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("BEGIN", (err, result) => {
        if (err) {
          this.logger.info("UNABLE TO START TRANSACTION", err);
          reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION STARTED");
        resolve(1);
      }),
    );
  }

  async commitTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("COMMIT", (err, result) => {
        if (err) {
          this.logger.info("UNABLE TO COMMIT TRANSACTION", err);
          reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION COMMITTED");
        resolve(1);
      }),
    );
  }

  async rollbackTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("ROLLBACK", (err, result) => {
        if (err) {
          this.logger.info("ROLLBACK TRANSACTION ERROR", err);
          reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION ROLLBACK");
        resolve(1);
      }),
    );
  }
}
