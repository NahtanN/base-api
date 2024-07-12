import { SignInRequest } from "./dtos/request/sign_in.request";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";

export default interface AuthenticationServiceInterface {
  signUp(dto: SignUpRequest): Promise<SignUpResponseInterface>;
  signIn(dto: SignInRequest): SignInResponseInterface;
  createJwtToken(payload: Record<string, any>): string;
  hashPassword(password: string): {
    salt: string;
    hash: string;
  };
}
