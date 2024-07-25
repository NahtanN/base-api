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

  it("should create a valid password", () => {
    const password = "password";
    const hashedPassword = authService.hashPassword(password);
    const isValid = authService.validatePassword(
      password,
      `${hashedPassword.salt}.${hashedPassword.hash}`,
    );

    expect(isValid).toBe(true);
  });

  describe("signUp", () => {
    it("should return a success message with access token", async () => {
      const dto: SignUpRequest = {
        name: "Foo Bar",
        email: "foo@bar.com",
        password: "password",
      };
      const user = specUtils.mockUser();
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
          AuthorizationFeatures.READ_USER_SELF,
        ],
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        id: user.getUserId(),
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
    it("should return an access token", async () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      const user = specUtils.mockUser({
        features: [AuthorizationFeatures.CREATE_TOKEN],
      });
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      jest.spyOn(authService, "validatePassword").mockReturnValueOnce(true);
      jest
        .spyOn(authService, "createJwtToken")
        .mockReturnValueOnce("accessToken");

      const result = await authService.signIn(dto);

      expect(result).toBeDefined();
      expect(typeof result.accessToken).toBe("string");
    });

    it("should throw an error on findByEmail", async () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      userRepositoryMock.findByEmail.mockRejectedValueOnce(
        new Error("Repository error"),
      );
      await expect(authService.signIn(dto)).rejects.toThrow(
        AppError.internalServerError("Não foi possível procurar o usuário."),
      );
    });

    it("should fail on user not found", async () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      userRepositoryMock.findByEmail.mockResolvedValueOnce(null);
      await expect(authService.signIn(dto)).rejects.toThrow(
        AppError.badRequest("Usuário ou senha inválidos."),
      );
    });

    it("should fail when user does not have permission", async () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      const user = specUtils.mockUser();
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      await expect(authService.signIn(dto)).rejects.toThrow(
        AppError.unauthorized("Usuário não possui autorização."),
      );
    });

    it("should fail on password validation", async () => {
      const dto: SignInRequest = {
        login: "foo@bar.com",
        password: "password",
      };

      const user = specUtils.mockUser({
        features: [AuthorizationFeatures.CREATE_TOKEN],
      });
      userRepositoryMock.findByEmail.mockResolvedValueOnce(user);
      jest.spyOn(authService, "validatePassword").mockReturnValueOnce(false);
      await expect(authService.signIn(dto)).rejects.toThrow(
        AppError.badRequest("Usuário ou senha inválidos."),
      );
    });
  });
});
