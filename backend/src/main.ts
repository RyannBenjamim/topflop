import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/exception-filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://topflop.vercel.app',
    ],
    credentials: true,
    exposedHeaders: [
      'Retry-After',
      'Retry-After-burst',
      'Retry-After-sustained',
    ],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapter));

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();