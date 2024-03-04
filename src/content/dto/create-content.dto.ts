import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateContentDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsUrl()
    url: string;

    notes: Text;

    categories: number[];

    @IsOptional()
    seen?: boolean;
}
