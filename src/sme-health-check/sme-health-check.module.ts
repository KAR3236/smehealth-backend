import { Module } from '@nestjs/common';
import { SmeHealthCheckController } from './sme-health-check.controller';
import { SmeHealthCheckService } from './sme-health-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { smeHealthCheck } from './entities/sme-health-check.entity';
import { MulterModule } from '@nestjs/platform-express';
import { storageConfig } from 'src/config/multerStorage.config';
import { smeHealthCheckImages } from './entities/sme-health-check-images.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([smeHealthCheck, smeHealthCheckImages]),
    MulterModule.register(storageConfig),
  ],
  controllers: [SmeHealthCheckController],
  providers: [SmeHealthCheckService],
})
export class SmeHealthCheckModule {}
