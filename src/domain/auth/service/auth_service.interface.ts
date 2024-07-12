import { SignInRequest } from "./dtos/request/sign_in.request";
import { SignUpRequest } from "./dtos/request/sign_up.request";
import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";

export default interface AuthServiceInterface {
  signUp(dto: SignUpRequest): Promise<SignUpResponseInterface>;
  signIn(dto: SignInRequest): SignInResponseInterface;
}
