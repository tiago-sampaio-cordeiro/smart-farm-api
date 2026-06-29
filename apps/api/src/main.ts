import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception/http-exception.filter';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ConfigService } from '@nestjs/config';
// import { writeFileSync } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', process.env.FRONTEND_URL || ''].filter(
      Boolean,
    ),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // converte automaticamente os tipos (ex: string para number)
      whitelist: true, // remove propriedades não declaradas nos DTOs
      forbidNonWhitelisted: true, // lança erro se o corpo contiver campos extras
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Smart Farm API')
    .setDescription('API de monitoramento agrícola com sensores IoT')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
