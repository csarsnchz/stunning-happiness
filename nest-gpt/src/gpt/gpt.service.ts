import * as fs from 'fs';
import * as path from 'path';
import { Injectable, NotFoundException } from '@nestjs/common';
import { orthographyCheckUseCase, prosConsDiscusserUseCase, prosConsDiscusserSteamUseCase, translateUseCase, textToAudioUseCase, audioToTextUseCase, imageGenerationUseCase, imageVariationUseCase } from './use-cases';
import { AudioToTextDto, ImageGenerationDTO, ImageVariationDto, OrthographyDto, ProsConsDiscusserDto, TextToAudioDTO, TranslatorDTO } from './dtos';

import OpenAI from 'openai';

@Injectable()
export class GptService {

    private openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    

    async orthographyCheck(orthographyDto: OrthographyDto) {
        return await orthographyCheckUseCase( this.openai, {
            prompt: orthographyDto.prompt,
        });
    }

    async prosConsDiscusser({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserUseCase( this.openai, { prompt });
    }

    async prosConsDiscusserStream({ prompt }: ProsConsDiscusserDto) {
        return await prosConsDiscusserSteamUseCase( this.openai, { prompt });
    }

    async languageTranslator({ prompt, lang }: TranslatorDTO) {
         return await translateUseCase( this.openai, { prompt, lang });
    }

    async textToAudio({ prompt, voice }: TextToAudioDTO) {
        return await textToAudioUseCase( this.openai, { prompt, voice });
   }

   async getAudio(fileID: string) {
    const filePath = path.resolve( __dirname, '../../generated/audios/', `${fileID}.mp3` );
    const fileExists = fs.existsSync( filePath );

    if (!fileExists) throw new NotFoundException(`File ${fileID}.mp3 not found`);
    
    return filePath;
    
}

async audioToText(options: { audioToTextDto: AudioToTextDto, audioFile: Express.Multer.File }) {
    return await audioToTextUseCase( this.openai, options );
}

async imageGeneration(imageGenerationDTO: ImageGenerationDTO) {
    return await imageGenerationUseCase( this.openai, imageGenerationDTO );
}

async getImage(filename: string) {
    const filePath = path.resolve( './', './generated/images/', `${filename}.png` );
    const fileExists = fs.existsSync( filePath );

    if (!fileExists) throw new NotFoundException(`File ${filename}.png not found`);
    
    return filePath;
}

async getImageVariation(imageVariationDto: ImageVariationDto) {
    const { baseImage } = imageVariationDto;
    return await imageVariationUseCase( this.openai, { baseImage });
}

}
