import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppConfig } from '@config/app.config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from '@common/filters/exception.filter';
import { AppType, getAppType } from '@common/utils/env';
import { setupSwagger } from '@config/swagger.config';
import { CronService } from './cron/cron.service';

async function bootstrap() {
  const appType = getAppType();
  console.info(`running as ${appType}`);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService<AppConfig>);

  app.set('trust proxy', true);
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.enableVersioning();

  app.useGlobalFilters(new GlobalExceptionFilter());

  if (appType === AppType.WebWorker) {
    const cron = app.get(CronService);
    await cron.setUpJobs();
  }

  setupSwagger(app);

  const port = config.get('port', { infer: true })!;
  await app.listen(port);
}

bootstrap().catch(console.error);
