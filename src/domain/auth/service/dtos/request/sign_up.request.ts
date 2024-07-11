import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpRequest {
  @ApiProperty({
    default: "Foo",
  })
  @IsNotEmpty({
    message: "O campo `nome` não deve ser vazio.",
  })
  name: string;

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
  email: string;

  @ApiProperty({
    default: "Senha123",
  })
  @IsNotEmpty({
    message: "O campo `senha` não deve ser vazio.",
  })
  password: string;
}
