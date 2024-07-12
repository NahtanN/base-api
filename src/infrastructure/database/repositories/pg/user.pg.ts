import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import PgConnection from "./@connection.pg";
import { Connection, PoolClient } from "pg";

export default class UserPgRepository
  implements PgConnection, UserRepositoryInterface {
  conn: PoolClient;

  constructor(conn: PoolClient) {
    this.conn = conn;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const { rows } = await this.conn.query(
      "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))",
      [email],
    );

    return rows[0].exists;
  }
}
