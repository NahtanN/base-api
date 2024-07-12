export default interface UserRepositoryInterface {
  /**
   * Validate if user email is already on the database
   * @param email string
   * */
  existsByEmail(email: string): Promise<boolean>;
}
