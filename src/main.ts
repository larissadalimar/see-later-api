import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions : CorsOptions = {
    origin: 'https://lulugonn.github.io/see_later_app/', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204
  }
  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
