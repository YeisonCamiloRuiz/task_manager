import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('TaskManager API')
  .setDescription('API for managing tasks in TaskManager application')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('tasks')
  .addTag('users')
  .build();
