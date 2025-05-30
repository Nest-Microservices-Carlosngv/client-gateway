import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.fiter';

async function bootstrap() {

  const logger = new Logger('Main-Gateway');
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api', {
    exclude: [{
      path: '',
      method: RequestMethod.GET,
    }]
  });

  app.useGlobalPipes( new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  app.useGlobalFilters( new RpcCustomExceptionFilter() );

  await app.listen( envs.port );
  console.log('Health check configured');
  logger.log(`Running on port ${ envs.port }`);
}
bootstrap();
