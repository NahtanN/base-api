import EntityParams from "@domain/@shared/entity_params.interface";
import AppError from "@shared/errors";
import { z } from "zod";
import { UserInterface } from "../interfaces/user.interface";

export default class UserEntity extends EntityParams {
  constructor(
    private id: number,
    private userId: string,
    private name: string,
    private email: string,
    private emailAuthenticated: boolean,
    private password: string,
    private features: string[],
    private acceptedAt: Date,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    super(createdAt, updatedAt, deletedAt);
    this.validate();
  }

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }

  getEmailAuthenticated() {
    return this.emailAuthenticated;
  }

  getPassword() {
    return this.password;
  }

  getFeatures() {
    return this.features;
  }

  getAcceptedAt() {
    return this.acceptedAt;
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
