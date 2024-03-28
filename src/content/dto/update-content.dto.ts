import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsBooleanString, IsOptional } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {

    @IsOptional()
    @IsBooleanString()
    seen?: boolean;

    @IsOptional()
    @IsBooleanString()
    favorite?: boolean;
}