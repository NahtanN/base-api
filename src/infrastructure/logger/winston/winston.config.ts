import { format, LoggerOptions, transports } from "winston";

export const winstonConfig: LoggerOptions = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple(),
      ),
    }),
  ],
};
