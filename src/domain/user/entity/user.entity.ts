import EntityParams from "@domain/@shared/entity_params.interface";
import AppError from "@shared/errors";
import { z } from "zod";

export default class UserEntity extends EntityParams {
  constructor(
    private _id: number,
    private _userId: string,
    private _name: string,
    private _email: string,
    private _emailAuthenticated: boolean,
    private _password: string,
    private _features: string[],
    private _acceptedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    super(createdAt, updatedAt, deletedAt);
    this.validate();
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get emailAuthenticated() {
    return this._emailAuthenticated;
  }

  get password() {
    return this._password;
  }

  get features() {
    return this._features;
  }

  get acceptedAt() {
    return this._acceptedAt;
  }

  validate() {
    const result = z
      .object({
        id: z.number(),
        userId: z.string(),
        name: z.string({
          message: "`name` precisa ser do tipo `string`.",
        }),
        email: z
          .string({
            message: "`email` precisa ser do tipo `string`.",
          })
          .email({
            message: "`email` precisa ser um email válido.",
          }),
        emailAuthenticated: z.boolean({
          message: "`emailAuthenticated` precisa ser do tipo `boolean`.",
        }),
        password: z.string({
          message: "`password` precisa ser do tipo `string`.",
        }),
        features: z.array(z.string(), {
          message: "`features` precisa ser do tipo `string[]`.",
        }),
        acceptedAt: z.date({
          message: "`acceptedAt` precisa ser do tipo `Date`.",
        }),
        createdAt: z.date({
          message: "`acceptedAt` precisa ser do tipo `Date`.",
        }),
        updatedAt: z.date({
          message: "`updatedAt` precisa ser do tipo `Date`.",
        }),
        deletedAt: z
          .date({
            message: "`deletedAt` precisa ser do tipo `Date`.",
          })
          .nullable(),
      })
      .safeParse(this);
    if (!result.success)
      throw AppError.invalidSchema(
        "Não foi possível criar o usuário.",
        result.error.format(),
      );
  }
}
