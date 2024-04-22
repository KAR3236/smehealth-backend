import { BadRequestException, Injectable } from '@nestjs/common';
import { AddHealthInfoDto } from './dto/addHealthInfo.dto';
import { smeHealthCheck } from 'src/models/sme-health-check.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handelResponse } from 'src/services/handleResponse';
import { message } from 'src/services/messages';
import { QueryFailedError } from 'typeorm';
import { ResponseInterface } from 'src/services/interfaces/commonInterface';
import { HealthInfoInterface } from 'src/services/interfaces/healthInfoInterface';
import { smeHealthCheckImages } from 'src/models/sme-health-check-images.model';

@Injectable()
export class SmeHealthCheckService {
  constructor(
    @InjectRepository(smeHealthCheck)
    private smeHealthCheckModel: Repository<smeHealthCheck>,
    @InjectRepository(smeHealthCheckImages)
    private smeHealthCheckImagesModel: Repository<smeHealthCheckImages>,
  ) {}

  async addHealthInfo(
    dto: AddHealthInfoDto,
    files: Array<Express.Multer.File>,
  ): Promise<ResponseInterface> {
    try {
      if (files.length > 6) {
        return handelResponse({
          statusCode: 400,
          message: `Exceeded maximum number of files (6)`,
        });
      }

      const smeImages: any = await Promise.all(
        files.map(async (file) => {
          if (!file.originalname.match(/\.(pdf)$/)) {
            throw new BadRequestException(`Only PDF file is allowed`);
          }
        }),
      );

      if (smeImages.length > 0) {
        const smeHealthData: HealthInfoInterface =
          await this.smeHealthCheckModel.save({
            ...dto,
          });
        const saveSmeImages: any = await Promise.all(
          files.map(async (file) => {
            return await this.smeHealthCheckImagesModel.save({
              smeHealthCheckId: smeHealthData.id,
              file: file.filename,
            });
          }),
        );

        if (smeHealthData && saveSmeImages.length > 0) {
          return handelResponse({
            statusCode: 201,
            message: `${message.FORM_SUBMIT_SUCCESSFULLY}`,
          });
        }
      }
    } catch (error) {
      if (error instanceof QueryFailedError) {
        return handelResponse({
          statusCode: 400,
          message: error.message,
        });
      } else if (error instanceof BadRequestException) {
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

  async listOfHealthInfo(listHealthInfoDto: any): Promise<ResponseInterface> {
    try {
      const getHealthInfo: HealthInfoInterface[] =
        await this.smeHealthCheckModel.find({
          relations: ['smeHealthCheckImages'],
          order: { id: 'DESC' },
          take: listHealthInfoDto.take,
          skip: listHealthInfoDto.skip,
        });

      return handelResponse({
        statusCode: 200,
        message: `SME Health data ${message.VIEW_SUCCESSFULLY}`,
        data: getHealthInfo,
      });
    } catch (error) {
      return handelResponse({
        statusCode: 500,
        message: message.PLEASE_TRY_AGAIN,
      });
    }
  }
}
