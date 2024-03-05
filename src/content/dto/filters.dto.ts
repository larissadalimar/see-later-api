import { IsArray, IsOptional, IsString, IsDateString } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsArray()
  categories?: string[];

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  seen?: boolean;

  @IsOptional()
  type?: string;
}
