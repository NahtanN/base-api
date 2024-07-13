import { SignUpRequest } from "./dtos/request/sign_up.request";
import { SignInRequest } from "./dtos/request/sign_in.request";
import LoggerInterface from "@infrastructure/logger/logger.interface";
import { SpecUtils } from "../../../@shared//utils/spec.utils";
import AuthenticationService from "./authentication.service";
import JwtServiceInterface from "@infrastructure/jwt_service/jwt_service.interface";
import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import UserEntity from "@domain/user/entity/user.entity";
import { AuthorizationFeatures } from "@domain/authorization/authorization_features.types";
import AppError from "@shared/errors";

describe("AuthService", () => {
  let authService: AuthenticationService;
  let logger: jest.Mocked<LoggerInterface>;
  let jwtServiceMock: jest.Mocked<JwtServiceInterface>;
  let userRepositoryMock: jest.Mocked<UserRepositoryInterface>;

  const specUtils = new SpecUtils();

  beforeEach(() => {
    jwtServiceMock = specUtils.jwtService() as jest.Mocked<JwtServiceInterface>;
    userRepositoryMock =
      specUtils.userRepository() as jest.Mocked<UserRepositoryInterface>;

    logger = specUtils.logger() as jest.Mocked<LoggerInterface>;
    authService = new AuthenticationService(
      logger,
      jwtServiceMock,
      userRepositoryMock,
    );
  });

  afterEach(() => {
    specUtils.resetAllMocks();
  });

  describe("signUp", () => {
    it("should return a success message with access token", async () => {
      const dto: SignUpRequest = {
        name: "Foo Bar",
        email: "foo@bar.com",
        password: "password",
      };
      const user = {
        id: 1,
        userId: "uuid",
      } as UserEntity;
      const accessToken = "mockedAccessToken";

      userRepositoryMock.existsByEmail.mockResolvedValueOnce(false);
      userRepositoryMock.create.mockResolvedValueOnce(user);
      jwtServiceMock.sign.mockReturnValueOnce(accessToken);

      const response = await authService.signUp(dto);

      expect(response).toEqual({
        message: "Usuário cadastrado com sucesso.",
        accessToken,
      });
      expect(userRepositoryMock.create).toHaveBeenCalledWith(
        dto.name,
        dto.email,
        expect.any(String),
        [
          AuthorizationFeatures.CREATE_TOKEN,
          AuthorizationFeatures.READ_TOKEN,
          AuthorizationFeatures.READ_USER_OWN,
          AuthorizationFeatures.CREATE_SERVICE_PROVIDER,
        ],
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        id: user.userId,
      });
    });

    it("should throw an error if email is already in use", async () => {
      const dto: SignUpRequest = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      };
      userRepositoryMock.existsByEmail.mockResolvedValueOnce(true);

      await expect(authService.signUp(dto)).rejects.toThrow(
        AppError.unauthorized("Email já está em uso."),
      );
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
