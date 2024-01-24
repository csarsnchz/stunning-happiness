import { IsOptional, IsString } from "class-validator";


export class TextToAudioDTO {
    @IsString()
    readonly prompt: string;

    @IsString()
    @IsOptional()
    readonly voice?: string;

}