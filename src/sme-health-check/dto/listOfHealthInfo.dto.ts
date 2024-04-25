import { IsString, IsOptional } from 'class-validator';

export class ListOfHealthInfoDto {
  @IsString()
  @IsOptional()
  orderfield: string;

  @IsString()
  @IsOptional()
  order: string;

  @IsString()
  @IsOptional()
  take: string;

  @IsString()
  @IsOptional()
  skip: string;
}
