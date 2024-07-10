import { NestFactory } from "@nestjs/core";
import { AppModule } from "./application/app.module";
import { Logger } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT, () =>
    Logger.log(
      `Application running on ${process.env.APP_URL}:${process.env.PORT}`,
    ),
  );
}
bootstrap();
