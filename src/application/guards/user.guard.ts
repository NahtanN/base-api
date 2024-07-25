import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";
import { AppUserService } from "../modules/user/user.service";
import UserEntity from "@domain/user/entity/user.entity";
import { AuthorizationFeatures } from "@domain/authorization/authorization_features.types";
import AppError from "@shared/errors";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly userService: AppUserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (
      !request.user ||
      (request.user.id && typeof request.user.id !== "string")
    ) {
      request.user = {
        features: [AuthorizationFeatures.CREATE_TOKEN],
      } as Partial<UserEntity>;
    }

    let user: UserEntity;
    try {
      user = await this.userService.findById(request.user.id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw AppError.internalServerError("Não foi possível validar o usuário.");
    }
    request.user = user;

    return true;
  }
}
