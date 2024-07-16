import LoggerInterface from "@infrastructure/logger/logger.interface";
import AppError from "@shared/errors";
import { PoolClient } from "pg";
import PgConnection from "./@connection.pg";
import { SpecUtils } from "@shared/index";

describe("PgConnection", () => {
  let pgConnection: PgConnection;
  let logger: jest.Mocked<LoggerInterface>;
  let poolClient: jest.Mocked<PoolClient>;

  const specUtils = new SpecUtils();

  beforeEach(() => {
    logger = specUtils.logger() as jest.Mocked<LoggerInterface>;
    poolClient = specUtils.conn() as jest.Mocked<PoolClient>;

    pgConnection = new PgConnection(logger, poolClient);
  });

  it("should log success message", () => {
    const query = "SELECT * FROM users";
    const params = [1, 2, 3];

    pgConnection.logSuccess(query, ...params);

    expect(logger.info).toHaveBeenCalledWith(
      "SUCCESS DATABASE QUERY",
      query,
      params,
    );
  });

  it("should log error message", () => {
    const query = "SELECT * FROM users";
    const params = [1, 2, 3];

    pgConnection.logError(query, ...params);

    expect(logger.error).toHaveBeenCalledWith(
      "ERROR DATABASE QUERY",
      query,
      params,
    );
  });

  describe("startTransaction", () => {
    it("should start a transaction successfully", async () => {
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(null, {});
      });
      await pgConnection.startTransaction();

      expect(poolClient.query).toHaveBeenCalledWith(
        "BEGIN",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith("TRANSACTION STARTED");
    });

    it("should fail to start a transaction", async () => {
      const error = new Error("Connection error");
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(error, {});
      });

      await expect(pgConnection.startTransaction()).rejects.toThrow(
        AppError.internalServerError("Erro no servidor"),
      );
      expect(poolClient.query).toHaveBeenCalledWith(
        "BEGIN",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        "UNABLE TO START TRANSACTION",
        error,
      );
    });
  });

  describe("commitTransaction", () => {
    it("should commit a transaction successfully", async () => {
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(null, {});
      });

      await pgConnection.commitTransaction();

      expect(poolClient.query).toHaveBeenCalledWith(
        "COMMIT",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith("TRANSACTION COMMITTED");
    });

    it("should fail to commit a transaction", async () => {
      const error = new Error("Connection error");
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(error, {});
      });

      await expect(pgConnection.commitTransaction()).rejects.toThrow(
        AppError.internalServerError("Erro no servidor"),
      );
      expect(poolClient.query).toHaveBeenCalledWith(
        "COMMIT",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        "UNABLE TO COMMIT TRANSACTION",
        error,
      );
    });
  });

  describe("query", () => {
    it("should create a Pg query", async () => {
      const query = "SELECT * FROM users";
      const params = ["param"];

      poolClient.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [] });
        },
      );

      await pgConnection.query(query, params);

      expect(poolClient.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
    });

    it("should create a Pg query with callback", async () => {
      const query = "SELECT * FROM users";
      const params = ["param"];

      poolClient.query.mockImplementationOnce(
        (query, params, callback: jest.Func) => {
          callback(null, { rows: [] });
        },
      );

      await pgConnection.query(query, params, (queryText, args) => {
        args[0] = "changed";
      });

      expect(poolClient.query).toHaveBeenCalledWith(
        query,
        params,
        expect.any(Function),
      );
      expect(params[0]).toBe("changed");
    });
  });

  describe("rollbackTransaction", () => {
    it("should rollback a transaction successfully", async () => {
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(null, {});
      });

      await pgConnection.rollbackTransaction();

      expect(poolClient.query).toHaveBeenCalledWith(
        "ROLLBACK",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith("TRANSACTION ROLLBACK");
    });

    it("should fail to rollback a transaction", async () => {
      const error = new Error("Connection error");
      poolClient.query.mockImplementationOnce((query, callback: jest.Func) => {
        callback(error, {});
      });

      await expect(pgConnection.rollbackTransaction()).rejects.toThrow(
        AppError.internalServerError("Erro no servidor"),
      );
      expect(poolClient.query).toHaveBeenCalledWith(
        "ROLLBACK",
        expect.any(Function),
      );
      expect(logger.info).toHaveBeenCalledWith(
        "ROLLBACK TRANSACTION ERROR",
        error,
      );
    });
  });
});
