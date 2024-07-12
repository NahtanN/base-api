import AuthService from "./auth.service";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import { SignInRequest } from "./dtos/request/sign_in.request";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import { SpecUtils } from "../../../@shared//utils/spec.utils";

describe("AuthService", () => {
  let authService: AuthService;
  let logger: jest.Mocked<LoggerInterface>;

  const specUtils = new SpecUtils();

  beforeEach(() => {
    logger = specUtils.logger() as jest.Mocked<LoggerInterface>;
    authService = new AuthService(logger);
  });

  afterEach(() => {
    specUtils.resetAllMocks();
  });

  describe("signUp", () => {
    it("should return a success message with access token", () => {
      const dto: SignUpRequest = {
        name: "Foo Bar",
        email: "foo@bar.com",
        password: "password",
      };

      const result = authService.signUp(dto);

      expect(result.message).toBe("Usuário cadastrado com sucesso.");
      expect(typeof result.accessToken).toBe("string");
    });
  });

  describe("signIn", () => {
    it("should return an access token", () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      const result = authService.signIn(dto);

      expect(typeof result.accessToken).toBe("string");
    });
  });
});
