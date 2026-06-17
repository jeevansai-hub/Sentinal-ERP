import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`[Sentinel ERP Backend] System is running on: http://localhost:${port}/api/v1`);
}

bootstrap().catch(err => {
  console.error('[Sentinel Boot Error]', err);
});
