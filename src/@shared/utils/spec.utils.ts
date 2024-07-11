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
}
