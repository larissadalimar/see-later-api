import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateContentDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsOptional()
    notes?: string;

    @IsOptional()
    categories?: number[];

    @IsNotEmpty()
    type: string;
}
