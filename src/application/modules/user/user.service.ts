import { UserService } from "@domain/user/service/user.service";
import UserPgRepository from "@infrastructure/database/repositories/pg/user.pg";
import { Injectable } from "@nestjs/common";
import UserRepository from "src/application/providers/database/pg/user.repository";

@Injectable()
export class AppUserService extends UserService {
  constructor(userRepository: UserRepository) {
    super(userRepository);
  }
}
