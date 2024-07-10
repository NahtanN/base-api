import { Controller, Get, Inject } from "@nestjs/common";
import LoggerInterface from "src/infrastructure/logger/logger.interface";

@Controller("auth")
export class AuthController {
  constructor(
    @Inject("LoggerInterface")
    private readonly loggerService: LoggerInterface,
  ) { }

  @Get()
  test() {
    this.loggerService.info("test", new Error("asd").message);
    this.loggerService.error("sasdadaaaaaaa");
    return "test";
  }
}
