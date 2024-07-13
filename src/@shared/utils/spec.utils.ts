import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import JwtServiceInterface from "@infrastructure/jwt_service/jwt_service.interface";
import LoggerInterface from "@infrastructure/logger/logger.interface";

export class SpecUtils {
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
    };
  }
}
