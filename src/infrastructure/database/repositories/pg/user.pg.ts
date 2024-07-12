import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import PgConnection from "./@connection.pg";
import { Connection, PoolClient } from "pg";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";

export default class UserPgRepository
  implements PgConnection, UserRepositoryInterface {
  logger: LoggerInterface;
  conn: PoolClient;

  constructor(logger: LoggerInterface, conn: PoolClient) {
    this.logger = logger;
    this.conn = conn;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query =
      "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))";
    try {
      const { rows } = await this.conn.query(query, [email]);
      this.logger.info("SUCCESS DATABASE QUERY", query, email);

      return rows[0].exists;
    } catch (error) {
      this.logger.error("ERROR DATABASE QUERY", query, email, error);
      throw AppError.internalServerError(
        "Não foi possível validar o email do usuário.",
      );
    }
  }
}
