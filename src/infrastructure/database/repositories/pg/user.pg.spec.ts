import LoggerInterface from "@infrastructure/logger/logger.interface";
import { AppError, SpecUtils } from "@shared/index";
import { PoolClient } from "pg";
import UserPgRepository from "./user.pg";
import UserEntity from "@domain/user/entity/user.entity";
import { record } from "zod";

describe("UserPgRepository", () => {
  let logger: jest.Mocked<LoggerInterface>;
  let conn: jest.Mocked<PoolClient>;
  let userRepository: UserPgRepository;

  const specUtils = new SpecUtils();

  beforeEach(() => {
    logger = specUtils.logger() as jest.Mocked<LoggerInterface>;
    conn = specUtils.conn() as jest.Mocked<PoolClient>;

    userRepository = new UserPgRepository(logger, conn);
  });

  afterEach(() => {
    specUtils.resetAllMocks();
  });

  describe("existsByEmail", () => {
    it("should return `true` if email exists", async () => {
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [{ exists: true }] });
        },
      );

      const email = "foo@bar.com";
      const response = await userRepository.existsByEmail(email);

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))";
      const params = [email];

      expect(response).toBe(true);
      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });

    it("should return `false` if email does not exists", async () => {
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [{ exists: false }] });
        },
      );

      const email = "foo@bar.com";
      const response = await userRepository.existsByEmail(email);

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))";
      const params = [email];

      expect(response).toBe(false);
      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });

    it("should return an AppError if fails", async () => {
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(new Error("Connection Error"), null);
        },
      );

      const email = "foo@bar.com";
      await expect(userRepository.existsByEmail(email)).rejects.toThrow(
        AppError.internalServerError(
          "Não foi possível validar o email do usuário.",
        ),
      );

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER($1))";
      const params = [email];

      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const userDto = {
        name: "Foo",
        email: "foo@bar.com",
        password: "password",
        features: ["feature1", "feature2"],
      };
      const date = new Date();
      const row = {
        ...userDto,
        id: 1,
        user_id: "uuid",
        email_authenticated: false,
        accepted_at: date,
        created_at: date,
        updated_at: date,
        deleted_at: date,
      };

      jest.spyOn(userRepository, "startTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "commitTransaction").mockResolvedValueOnce();
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [row] });
        },
      );

      const response = await userRepository.create(
        userDto.name,
        userDto.email,
        userDto.password,
        userDto.features,
      );

      expect(response).toBeInstanceOf(UserEntity);
      expect(response.id).toBe(row.id);
      expect(response.email).toBe(userDto.email);
      expect(userRepository.startTransaction).toHaveBeenCalled();
      expect(userRepository.commitTransaction).toHaveBeenCalled();
      expect(conn.query).toHaveBeenCalledWith(
        "INSERT INTO users (name, email, password, features) VALUES (TRIM($1), TRIM($2), $3, $4) RETURNING *",
        [userDto.name, userDto.email, expect.any(String), userDto.features],
        expect.any(Function),
      );
    });

    it("should fail to insert on database when `new UserEntity()` has an error", async () => {
      const userDto = {
        name: "Foo",
        email: "foo@bar.com",
        password: "password",
        features: ["feature1", "feature2"],
      };
      const date = new Date();
      const row = {
        ...userDto,
        id: 1,
        user_id: "uuid",
        email_authenticated: "error",
      };

      jest.spyOn(userRepository, "startTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "rollbackTransaction").mockResolvedValueOnce();
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [row] });
        },
      );

      await expect(
        userRepository.create(
          userDto.name,
          userDto.email,
          userDto.password,
          userDto.features,
        ),
      ).rejects.toThrow(
        AppError.invalidSchema(
          "Não foi possível criar o usuário.",
          expect.any(record),
        ),
      );

      expect(userRepository.startTransaction).toHaveBeenCalled();
      expect(userRepository.rollbackTransaction).toHaveBeenCalled();
    });

    it("should fail to start a database transaction and throw an error", async () => {
      const userDto = {
        name: "Foo",
        email: "foo@bar.com",
        password: "password",
        features: ["feature1", "feature2"],
      };

      jest
        .spyOn(userRepository, "startTransaction")
        .mockRejectedValueOnce(new Error("Erro no servidor."));
      jest.spyOn(userRepository, "rollbackTransaction").mockResolvedValueOnce();

      await expect(
        userRepository.create(
          userDto.name,
          userDto.email,
          userDto.password,
          userDto.features,
        ),
      ).rejects.toThrow(
        AppError.internalServerError(
          "Não foi possível salvar o usuário no banco de dados.",
        ),
      );

      expect(userRepository.startTransaction).toHaveBeenCalledWith();
      expect(userRepository.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const date = new Date();

      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, {
            rows: [
              {
                id: 1,
                user_id: "uuid",
                name: "Foo",
                email: "foo@bar.com",
                email_authenticated: false,
                password: "password",
                features: ["feature1", "feature2"],
                accepted_at: date,
                created_at: date,
                updated_at: date,
                deleted_at: date,
              },
            ],
          });
        },
      );

      const email = "foo@bar.com";
      const response = await userRepository.findByEmail(email);

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(response).toBeInstanceOf(UserEntity);
      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });

    it("should return null on user not found", async () => {
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, {
            rows: [],
          });
        },
      );

      const email = "foo@bar.com";
      const response = await userRepository.findByEmail(email);

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(response).toBe(null);
      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });

    it("should throw an error AppError on database error", async () => {
      conn.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(new Error("Connection Error"), null);
        },
      );

      const email = "foo@bar.com";
      await expect(userRepository.findByEmail(email)).rejects.toThrow(
        AppError.internalServerError(
          "Não foi possível procurar o usuário no banco de dados.",
        ),
      );

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(conn.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });
  });
});
