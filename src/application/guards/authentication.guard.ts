import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import AppError from "@shared/errors";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/is_public.decorator";
import UserRepositoryInterface from "@domain/user/repository/user_repository.interface";
import { AppUserService } from "../modules/user/user.service";

@Injectable()
export class AuthenticationGuard extends AuthGuard("jwt") {
  constructor(
    private reflector: Reflector,
    private userService: AppUserService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    try {
      await super.canActivate(context);
    } catch {
      throw AppError.unauthorized("Usuário não possui autorização.");
    }
    return true;
  }
}
