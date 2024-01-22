import { IsString } from "class-validator";


export class TranslatorDTO {
    @IsString()
    readonly prompt: string;

    @IsString()
    readonly lang: string;
}