import { Global, Injectable } from "@nestjs/common";
import WinstonLogger from "src/infrastructure/logger/winston/winston.logger";

@Injectable()
export default class WinstonService extends WinstonLogger {}
