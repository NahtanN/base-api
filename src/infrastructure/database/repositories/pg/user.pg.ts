import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import PgConnection from "./@connection.pg";
import { Connection, PoolClient } from "pg";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";
import UserEntity from "@domain/user/entity/user.entity";

export default class UserPgRepository
  implements PgConnection, UserRepositoryInterface
{
  logger: LoggerInterface;
  conn: PoolClient;

  constructor(logger: LoggerInterface, conn: PoolClient) {
    this.logger = logger;
    this.conn = conn;
  }

  logSuccess(query: string, ...params: any[]): void {
    this.logger.info("SUCCESS DATABASE QUERY", query, params);
  }

  logError(query: string, ...params: any[]): void {
    this.logger.error("ERROR DATABASE QUERY", query, params);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query =
      "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))";
    const params = [email];

    try {
      const rows = await new Promise((resolve, reject) =>
        this.conn.query(query, params, (err, result) => {
          if (err) {
            this.logError(query, params);
            reject(err);
          }

          this.logSuccess(query, params);
          resolve(result.rows);
        }),
      );

      return rows[0].exists;
    } catch (error) {
      throw AppError.internalServerError(
        "Não foi possível validar o email do usuário.",
      );
    }
  }

  async create(
    name: string,
    email: string,
    password: string,
    features: string[],
  ): Promise<UserEntity> {
    const query =
      "INSERT INTO users (name, email, password, features) VALUES (TRIM($1), TRIM($2), $3, $4) RETURNING *";
    const params = [name, email, password, features];

    try {
      await this.conn.query("BEGIN");
      const rows = await new Promise((resolve, reject) =>
        this.conn.query(query, params, (err, result) => {
          // password field must be redacted
          params[2] = "redacted";

          if (err) {
            this.logError(query, params);
            reject(err);
          }

          this.logSuccess(query, params);
          resolve(result.rows);
        }),
      );
      const user = rows[0];

      const userEntity = new UserEntity(
        user.id,
        user.user_id,
        user.name,
        user.email,
        user.email_authenticated,
        user.password,
        user.features,
        user.accepted_at,
        user.created_at,
        user.updated_at,
        user.deleted_at,
      );

      await this.conn.query("COMMIT");
      return userEntity;
    } catch (error) {
      if (error instanceof AppError && error.data) {
        throw error;
      }

      throw AppError.internalServerError(
        "Não foi possível salvar o usuário no banco de dados.",
      );
    } finally {
      await this.conn.query("ROLLBACK");
    }
  }
}
