// app-inventario/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS
  app.enableCors();
  
  // Configurar validación global de pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Configurar prefijo global para las rutas API
  app.setGlobalPrefix('api');
  
  // Usar puerto desde variables de entorno o 3000 por defecto
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Aplicación iniciada en puerto: ${port}`);
}
bootstrap();