import { NestFactory } from "@nestjs/core";
import { AppModule } from "./application/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import * as morgan from "morgan";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(
    morgan("combined", {
      immediate: true,
    }),
  );

  if (process.env.NODE_ENV !== "prod") {
    const config = new DocumentBuilder()
      .setTitle("AFY - Docs")
      .setDescription("All For You Documentation")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);
    Logger.log(
      `Swagger docs running on ${process.env.APP_URL}:${process.env.PORT}/docs`,
    );
  }

  await app.listen(process.env.PORT, () =>
    Logger.log(
      `Application running on ${process.env.APP_URL}:${process.env.PORT}`,
    ),
  );
}
bootstrap();
