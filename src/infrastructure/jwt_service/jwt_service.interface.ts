export default interface JwtServiceInterface {
  sign(payload: Record<string, any>): string;
}
