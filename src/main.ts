import { NestFactory } from "@nestjs/core";
import { AppModule } from "./application/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    morgan("combined", {
      immediate: true,
    }),
  );

  await app.listen(process.env.PORT, () =>
    Logger.log(
      `Application running on ${process.env.APP_URL}:${process.env.PORT}`,
    ),
  );
}
bootstrap();
