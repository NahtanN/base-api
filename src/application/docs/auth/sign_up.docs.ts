import { applyDecorators } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export function SignUpDocs() {
  return applyDecorators(
    ApiOperation({
      summary: "Cadastrar usuário.",
    }),
    ApiResponse({
      status: 201,
      schema: {
        example: {
          message: "Usuário cadastrado com sucesso.",
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
