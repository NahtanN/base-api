import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpRequest {
  @IsNotEmpty({
    message: "O campo `nome` não deve ser vazio.",
  })
  name: string;

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

  @IsNotEmpty({
    message: "O campo `senha` não deve ser vazio.",
  })
  password: string;
}
