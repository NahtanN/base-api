require("dotenv").config();
import { Module } from "@nestjs/common";
import { Pool } from "pg";
import { PG_CONNECTION } from "src/application/constants";
import UserRepository from "./user.repository";

const dbProvider = {
  provide: PG_CONNECTION,
  useValue: new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_SCHEMA,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  }),
};

@Module({
  providers: [dbProvider, UserRepository],
  exports: [UserRepository],
})
export default class PgModule { }
