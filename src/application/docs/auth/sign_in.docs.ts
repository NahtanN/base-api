import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export function SignInDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Logar com usuário.",
    }),
    ApiResponse({
      status: 201,
      schema: {
        example: {
          accessToken: "eyJhbGciOiJIUzI1NiIsIn...",
        },
      },
    }),
    ApiBadRequestResponse({
      schema: {
        example: {
          message: [
            "O campo `email` deve ser um email.",
            "O campo `senha` não deve ser vazio.",
          ],
          error: "Bad Request",
          statusCode: 400,
        },
      },
    }),
  );
}
