import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmeHealthCheckModule } from './sme-health-check/sme-health-check.module';
import { smeHealthCheck } from './models/sme-health-check.model';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { smeHealthCheckImages } from './models/sme-health-check-images.model';

type SupportedDialect = 'postgres';

@Module({
  imports: [
    //Configure configuration module for .env file
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DIALECT as SupportedDialect,
      host: process.env.DBHOST,
      port: +process.env.DBPORT,
      username: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DBNAME,
      entities: [smeHealthCheck, smeHealthCheckImages],
      synchronize: true, // Add migration
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', './upload'),
    }),
    SmeHealthCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
