import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SmeHealthCheckService } from './sme-health-check.service';
import { AddHealthInfoDto } from './dto/addHealthInfo.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ResponseInterface } from 'src/services/interfaces/commonInterface';

@Controller('sme-health-check')
export class SmeHealthCheckController {
  constructor(private smeHealthCheckService: SmeHealthCheckService) {}

  //Add health-info API.
  @Post('health-info')
  @UseInterceptors(FilesInterceptor('file'))
  registration(
    @Body() addHealthInfoDto: AddHealthInfoDto,
    @UploadedFiles() file: Array<Express.Multer.File>,
  ): Promise<ResponseInterface> {
    return this.smeHealthCheckService.addHealthInfo(addHealthInfoDto, file);
  }

  //List of health-info API.
  @Get('health-info')
  listOfHealthInfo(
    @Query() listHealthInfoDto: any,
  ): Promise<ResponseInterface> {
    return this.smeHealthCheckService.listOfHealthInfo(listHealthInfoDto);
  }

  //List of health-info-pdf API.
  @Get('health-info-pdf/:id')
  viewHealthInfoPdf(@Param() params: any): Promise<ResponseInterface> {
    return this.smeHealthCheckService.viewHealthInfoPdf(params);
  }
}
