import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInRequest {
  @ApiProperty({
    default: "foo@bar.com",
  })
  @IsNotEmpty({
    message: "O campo `email` não deve ser vazio.",
  })
  @IsEmail(
    {},
    {
      message: "O campo `email` deve ser um email.",
    },
  )
  login: string;

  @ApiProperty({
    default: "Senha123",
  })
  @IsNotEmpty({
    message: "O campo `senha` não deve ser vazio.",
  })
  password: string;
}
