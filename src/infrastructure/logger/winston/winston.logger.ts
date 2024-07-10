import { createLogger, Logger } from "winston";
import { winstonConfig } from "./winston.config";
import LoggerInterface from "../logger.interface";
import { LoggerLevels } from "../logger_level.types";
import { Injectable } from "@nestjs/common";

export default class WinstonLogger implements LoggerInterface {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger(winstonConfig);
  }

  private log(loggerLevel: string, message: any, ...optionalParams: any[]) {
    this.logger.log(loggerLevel, message, optionalParams);
  }

  emergency(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.EMERG, message, optionalParams);
  }

  alert(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.ALERT, message, optionalParams);
  }

  critical(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.CRIT, message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.ERROR, message, optionalParams);
  }

  warning(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.WARNING, message, optionalParams);
  }

  notice(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.NOTICE, message, optionalParams);
  }

  info(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.INFO, message, optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.log(LoggerLevels.DEBUG, message, optionalParams);
  }
}
