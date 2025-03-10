import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  
  app.enableCors();
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  await app.listen(port);
  
  const nodeEnv = configService.get('NODE_ENV', 'development');
  console.log(`Aplicación ejecutándose en modo ${nodeEnv}`);
  console.log(`Servidor ejecutándose en: http://localhost:${port}/api`);
}
bootstrap();