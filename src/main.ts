import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,//Para transformar la data de QueryParameters en la paginacion
      transformOptions: {//Para transformar la data de QueryParameters en la paginacion
        enableImplicitConversion: true,//Para transformar la data de QueryParameters en la paginacion
      }
    })
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
