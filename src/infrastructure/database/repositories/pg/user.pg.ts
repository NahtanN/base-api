import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import PgConnection from "./@connection.pg";
import { Connection, PoolClient } from "pg";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";
import UserEntity from "@domain/user/entity/user.entity";

export default class UserPgRepository
  extends PgConnection
  implements UserRepositoryInterface {
  constructor(logger: LoggerInterface, conn: PoolClient) {
    super(logger, conn);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const query =
      "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER(TRIM($1)))";
    const params = [email];

    try {
      const rows = await this.query(query, params);
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
      "INSERT INTO users (name, email, password, features) VALUES (TRIM($1), LOWER(TRIM($2)), $3, $4) RETURNING *";
    const params = [name, email, password, features];

    try {
      await this.startTransaction();
      const rows = await this.query(query, params, (queryText, args) => {
        args[2] = "redacted";
      });
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

      await this.commitTransaction();
      return userEntity;
    } catch (error) {
      await this.rollbackTransaction();

      if (
        error instanceof AppError ||
        (error instanceof AppError && error.data)
      ) {
        throw error;
      }

      throw AppError.internalServerError(
        "Não foi possível salvar o usuário no banco de dados.",
      );
    }
  }

  async find(query: string, params: any[]): Promise<UserEntity | null> {
    try {
      const rows = await this.query(query, params);
      const user = rows[0];

      if (!user) {
        return null;
      }

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

      return userEntity;
    } catch (error) {
      if (
        error instanceof AppError ||
        (error instanceof AppError && error.data)
      ) {
        throw error;
      }

      throw AppError.internalServerError(
        "Não foi possível procurar o usuário no banco de dados.",
      );
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
    const params = [email];

    return this.find(query, params);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const params = [id];

    return this.find(query, params);
  }
}
