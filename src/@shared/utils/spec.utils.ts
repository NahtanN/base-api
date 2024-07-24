import UserEntity from "@domain/user/entity/user.entity";
import { UserInterface } from "@domain/user/interfaces/user.interface";
import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import JwtServiceInterface from "@infrastructure/jwt_service/jwt_service.interface";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import { randomUUID } from "crypto";
import { PoolClient } from "pg";

export class SpecUtils {
  mockUser(partial = {} as Partial<UserInterface>): UserEntity {
    const id = partial.id || Math.floor(Math.random() * 101);
    const uuid = partial.userId || randomUUID();
    const name = partial.name || "Foo Bar";
    const email = partial.email || "foo@bar.com";
    const emailAuthenticated = partial.emailAuthenticated || false;
    const password = partial.password || "hashedPassword";
    const features = partial.features || [];
    const acceptedAt = partial.acceptedAt || new Date();
    const createdAt = partial.createdAt || new Date();
    const updatedAt = partial.updatedAt || new Date();
    const deletedAt = partial.deletedAt || new Date();

    return new UserEntity(
      id,
      uuid,
      name,
      email,
      emailAuthenticated,
      password,
      features,
      acceptedAt,
      createdAt,
      updatedAt,
      deletedAt,
    );
  }

  resetAllMocks() {
    jest.resetAllMocks();
  }

  logger(): LoggerInterface {
    return {
      emergency: jest.fn(),
      alert: jest.fn(),
      critical: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
      notice: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
    };
  }

  jwtService(): JwtServiceInterface {
    return {
      sign: jest.fn(),
    };
  }

  userRepository(): UserRepositoryInterface {
    return {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };
  }

  conn(): Partial<PoolClient> {
    return {
      query: jest.fn(),
    };
  }
}
