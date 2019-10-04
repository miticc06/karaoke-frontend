import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
