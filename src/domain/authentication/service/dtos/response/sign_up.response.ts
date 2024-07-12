import DefaultResponseInterface from "./default.response";

export default interface SignUpResponseInterface
  extends DefaultResponseInterface {
  accessToken: string;
}
