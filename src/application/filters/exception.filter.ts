import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import AppError from "@shared/errors";
import { Response } from "express";
import { z, ZodFormattedError } from "zod";

@Catch()
export default class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BadRequestException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    if (!(exception instanceof AppError)) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro no servidor.",
      });
    }

    const body: {
      statusCode: number;
      message: string;
      errors?: string[];
    } = {
      statusCode: exception.statusCode,
      message: exception.message,
    };

    if (exception.data) {
      body.errors = this.mapZodSchemaErrors(exception.data);
    }

    return response.status(exception.statusCode).json(body);
  }

  mapZodSchemaErrors(data: Record<string, any>) {
    const keys = Object.keys(data);
    const errors: string[] = [];

    for (const key of keys) {
      const value = data[key];
      if (Array.isArray(value) || !value?._errors) {
        continue;
      }

      value._errors.forEach((error) => errors.push(error));
    }

    return errors;
  }
}
