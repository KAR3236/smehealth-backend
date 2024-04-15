import { Injectable } from '@nestjs/common';
import { AddHealthInfoDto } from './dto/addHealthInfo.dto';
import { smeHealthCheck } from 'src/models/sme-health-check.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handelResponse } from 'src/services/handleResponse';
import { message } from 'src/services/messages';
import { QueryFailedError } from 'typeorm';
import { randomName } from 'src/config/randomNumber.config';
import { ResponseInterface } from 'src/services/interfaces/commonInterface';
import { HealthInfoInterface } from 'src/services/interfaces/healthInfoInterface';

@Injectable()
export class SmeHealthCheckService {
  constructor(
    @InjectRepository(smeHealthCheck)
    private smeHealthCheckModel: Repository<smeHealthCheck>,
  ) {}

  async addHealthInfo(
    dto: AddHealthInfoDto,
    file: Express.Multer.File,
  ): Promise<ResponseInterface> {
    try {
      if (!file.originalname.match(/\.(pdf)$/)) {
        return handelResponse({
          statusCode: 400,
          message: `Only PDF file is allowed`,
        });
      }

      const extension: string = file.originalname
        .split('.')
        .pop()
        .toLowerCase();
      const renameFile: string = `${randomName}.${extension}`;

      const smeHealthData: HealthInfoInterface =
        await this.smeHealthCheckModel.save({
          ...dto,
          file: renameFile,
        });

      if (smeHealthData) {
        return handelResponse({
          statusCode: 201,
          message: `${message.FORM_SUBMIT_SUCCESSFULLY}`,
        });
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return handelResponse({
          statusCode: 400,
          message: error.message,
        });
      } else {
        return handelResponse({
          statusCode: 500,
          message: message.PLEASE_TRY_AGAIN,
        });
      }
    }
  }

  async listOfHealthInfo(): Promise<ResponseInterface> {
    try {
      const getHealthInfo: HealthInfoInterface[] =
        await this.smeHealthCheckModel.find({
          order: { id: 'DESC' },
        });

      if (getHealthInfo.length > 0) {
        return handelResponse({
          statusCode: 200,
          message: `SME Health data ${message.VIEW_SUCCESSFULLY}`,
          data: getHealthInfo,
        });
      } else {
        return handelResponse({
          statusCode: 404,
          message: `Data ${message.NOT_FOUND}`,
        });
      }
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }
}
