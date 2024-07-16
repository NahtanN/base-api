import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";
import { PoolClient } from "pg";
import CallbackQueryPgInterface from "./interfaces/callback_query.pg.interface";

export default class PgConnection {
  constructor(
    private logger: LoggerInterface,
    private _conn: PoolClient,
  ) { }

  get conn() {
    return this._conn;
  }

  logSuccess(query: string, ...params: any[]): void {
    this.logger.info("SUCCESS DATABASE QUERY", query, params);
  }

  logError(query: string, ...params: any[]): void {
    this.logger.error("ERROR DATABASE QUERY", query, params);
  }

  async query(
    queryText: string,
    params: any[],
    ...calbacks: CallbackQueryPgInterface[]
  ) {
    return await new Promise((resolve, reject) =>
      this.conn.query(queryText, params, (err, result) => {
        for (const cb of calbacks) {
          cb(queryText, params);
        }

        if (err) {
          this.logError(queryText, params);
          return reject(err);
        }

        this.logSuccess(queryText, params);
        return resolve(result.rows);
      }),
    );
  }

  async startTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("BEGIN", (err, result) => {
        if (err) {
          this.logger.info("UNABLE TO START TRANSACTION", err);
          return reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION STARTED");
        return resolve(1);
      }),
    );
  }

  async commitTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("COMMIT", (err, result) => {
        if (err) {
          this.logger.info("UNABLE TO COMMIT TRANSACTION", err);
          return reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION COMMITTED");
        return resolve(1);
      }),
    );
  }

  async rollbackTransaction() {
    await new Promise((resolve, reject) =>
      this.conn.query("ROLLBACK", (err, result) => {
        if (err) {
          this.logger.info("ROLLBACK TRANSACTION ERROR", err);
          return reject(AppError.internalServerError("Erro no servidor"));
        }

        this.logger.info("TRANSACTION ROLLBACK");
        return resolve(1);
      }),
    );
  }
}
