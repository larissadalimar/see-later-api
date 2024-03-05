import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends PartialType(CreateContentDto) {

    @IsOptional()
    seen?: boolean;

}