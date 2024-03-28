import { IsArray, IsOptional, IsString, IsDateString, IsBoolean, IsNumber, IsBooleanString, IsNumberString } from 'class-validator';

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
  @IsNumberString()
  days: number;

  @IsOptional()
  @IsBooleanString()
  seen?: boolean;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsBooleanString()
  favorite?: boolean;

  @IsOptional()
  @IsNumberString()
  consume_date?: number;

  @IsOptional()
  @IsString()
  order?: string;
}
