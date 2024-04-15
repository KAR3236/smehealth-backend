import { Module } from '@nestjs/common';
import { SmeHealthCheckController } from './sme-health-check.controller';
import { SmeHealthCheckService } from './sme-health-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { smeHealthCheck } from 'src/models/sme-health-check.model';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/multerStorage.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([smeHealthCheck]),
    MulterModule.register(storageConfig),
  ],
  controllers: [SmeHealthCheckController],
  providers: [SmeHealthCheckService],
})
export class SmeHealthCheckModule {}
