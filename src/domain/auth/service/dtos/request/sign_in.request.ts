import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInRequest {
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

  @IsNotEmpty({
    message: "O campo `senha` não deve ser vazio.",
  })
  password: string;
}
