import SignInResponseInterface from "./dtos/response/sign_in.response";
import SignUpResponseInterface from "./dtos/response/sign_up.response";

export default interface AuthServiceInterface {
  signUp(): SignUpResponseInterface;
  signIn(): SignInResponseInterface;
}
