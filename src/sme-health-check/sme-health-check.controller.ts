import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SmeHealthCheckService } from './sme-health-check.service';
import { AddHealthInfoDto } from './dto/addHealthInfo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResponseInterface } from 'src/services/interfaces/commonInterface';

@Controller('sme-health-check')
export class SmeHealthCheckController {
  constructor(private smeHealthCheckService: SmeHealthCheckService) {}

  //Add health-info API.
  @Post('health-info')
  @UseInterceptors(FileInterceptor('file'))
  registration(
    @Body() addHealthInfoDto: AddHealthInfoDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseInterface> {
    return this.smeHealthCheckService.addHealthInfo(addHealthInfoDto, file);
  }

  //List of health-info API.
  @Get('health-info')
  viewUser(): Promise<ResponseInterface> {
    return this.smeHealthCheckService.listOfHealthInfo();
  }
}
