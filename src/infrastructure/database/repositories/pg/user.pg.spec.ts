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
      jest
        .spyOn(userRepository, "query")
        .mockResolvedValueOnce([{ exists: true }]);

      const email = "foo@bar.com";
      const response = await userRepository.existsByEmail(email);

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER(TRIM($1)))";
      const params = [email];

      expect(response).toBe(true);
      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });

    it("should return `false` if email does not exists", async () => {
      jest
        .spyOn(userRepository, "query")
        .mockResolvedValueOnce([{ exists: false }]);

      const email = "foo@bar.com";
      const response = await userRepository.existsByEmail(email);

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER(TRIM($1)))";
      const params = [email];

      expect(response).toBe(false);
      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });

    it("should return an AppError if fails", async () => {
      jest
        .spyOn(userRepository, "query")
        .mockRejectedValueOnce(new Error("Database error"));

      const email = "foo@bar.com";
      await expect(userRepository.existsByEmail(email)).rejects.toThrow(
        AppError.internalServerError(
          "Não foi possível validar o email do usuário.",
        ),
      );

      const query =
        "SELECT EXISTS(SELECT 1 FROM users WHERE email LIKE LOWER(TRIM($1)))";
      const params = [email];

      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const date = new Date();
      const userData = {
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
      };

      jest.spyOn(userRepository, "startTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "commitTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "query").mockResolvedValueOnce([userData]);

      const callback = (queryText, args) => {
        args[2] = "redacted";
      };

      const response = await userRepository.create(
        userData.name,
        userData.email,
        userData.password,
        userData.features,
      );

      expect(response).toBeInstanceOf(UserEntity);
      expect(response.id).toBe(userData.id);
      expect(response.email).toBe(userData.email);
      expect(userRepository.startTransaction).toHaveBeenCalled();
      expect(userRepository.commitTransaction).toHaveBeenCalled();
      expect(userRepository.query).toHaveBeenCalledWith(
        "INSERT INTO users (name, email, password, features) VALUES (TRIM($1), LOWER(TRIM($2)), $3, $4) RETURNING *",
        [userData.name, userData.email, expect.any(String), userData.features],
        expect.any(Function),
      );
    });

    it("should fail to insert on database when `new UserEntity()` has an error", async () => {
      const date = new Date();
      const row = {
        id: 1,
        user_id: "uuid",
        email_authenticated: "error",
        name: "Foo",
        email: "foo@bar.com",
        password: "password",
        features: ["feature1", "feature2"],
      };

      jest.spyOn(userRepository, "startTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "rollbackTransaction").mockResolvedValueOnce();
      jest.spyOn(userRepository, "query").mockResolvedValueOnce([row]);

      await expect(
        userRepository.create(row.name, row.email, row.password, row.features),
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

      jest.spyOn(userRepository, "query").mockResolvedValueOnce([
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
      ]);

      const email = "foo@bar.com";
      const response = await userRepository.findByEmail(email);

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(response).toBeInstanceOf(UserEntity);
      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });

    it("should return null on user not found", async () => {
      jest.spyOn(userRepository, "query").mockResolvedValueOnce([]);

      const email = "foo@bar.com";
      const response = await userRepository.findByEmail(email);

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(response).toBe(null);
      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });

    it("should throw an error AppError on database error", async () => {
      jest
        .spyOn(userRepository, "query")
        .mockRejectedValueOnce(new Error("Database Error"));

      const email = "foo@bar.com";
      await expect(userRepository.findByEmail(email)).rejects.toThrow(
        AppError.internalServerError(
          "Não foi possível procurar o usuário no banco de dados.",
        ),
      );

      const query = "SELECT * FROM users WHERE email LIKE LOWER(TRIM($1))";
      const params = [email];

      expect(userRepository.query).toHaveBeenCalledWith(query, params);
    });
  });
});
