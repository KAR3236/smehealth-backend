import { BadRequestException, Injectable } from '@nestjs/common';
import { AddHealthInfoDto } from './dto/addHealthInfo.dto';
import { smeHealthCheck } from './entities/sme-health-check.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { handelResponse } from 'src/services/handleResponse';
import { message } from 'src/services/messages';
import { QueryFailedError } from 'typeorm';
import { ResponseInterface } from 'src/services/interfaces/commonInterface';
import {
  HealthImagesInterface,
  HealthInfoInterface,
} from 'src/services/interfaces/healthInfoInterface';
import { smeHealthCheckImages } from './entities/sme-health-check-images.entity';
import { ListOfHealthInfoDto } from './dto/listOfHealthInfo.dto';

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
    file: Array<Express.Multer.File>,
  ): Promise<ResponseInterface> {
    try {
      if (file.length > 6) {
        return handelResponse({
          statusCode: 400,
          message: `Exceeded maximum number of files (6)`,
        });
      }

      const smeImages: any = await Promise.all(
        file.map(async (file) => {
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
          file.map(async (file) => {
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

  async listOfHealthInfo(
    listHealthInfoDto: ListOfHealthInfoDto,
  ): Promise<ResponseInterface> {
    try {
      const order =
        listHealthInfoDto.orderfield === ''
          ? {}
          : { [listHealthInfoDto.orderfield]: listHealthInfoDto.order };
      const getHealthInfo: HealthInfoInterface[] =
        await this.smeHealthCheckModel.find({
          relations: ['smeHealthCheckImages'],
          order,
          take: listHealthInfoDto.take
            ? parseInt(listHealthInfoDto.take)
            : null,
          skip: listHealthInfoDto.skip
            ? parseInt(listHealthInfoDto.skip)
            : null,
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

  async viewHealthInfoPdf(params: any): Promise<ResponseInterface> {
    try {
      const getHealthInfo: HealthImagesInterface[] =
        await this.smeHealthCheckImagesModel.find({
          where: {
            smeHealthCheckId: params.id,
          },
        });

      return handelResponse({
        statusCode: 200,
        message: `SME Health PDF ${message.VIEW_SUCCESSFULLY}`,
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
