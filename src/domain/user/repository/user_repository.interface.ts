import UserEntity from "../entity/user.entity";

export default interface UserRepositoryInterface {
  /**
   * Validate if user email is already on the database
   * @param email string
   * */
  existsByEmail(email: string): Promise<boolean>;

  /**
   * Insert new user into database and return a UserEntity
   * @param name - string
   * @param email - string
   * @param password - string
   * @param features - string[]; should be of AuthorizationFeatures
   * @throws ApiError
   * */
  create(
    name: string,
    email: string,
    password: string,
    features: string[],
  ): Promise<UserEntity>;

  /**
   * Return a UserEntity if `email` is located on `users` table. If not, returns null.
   * @param email - string
   * @returns UserEntity | null
   * @throws ApiError
   * */
  findByEmail(email: string): Promise<UserEntity | null>;
}
