import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslatorDTO, TextToAudioDTO } from './dtos';
import { Response } from 'express';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

   @Post('orthography-check')
    orthographyCheck(
      @Body() orthographyDto: OrthographyDto,
    ) {
      return this.gptService.orthographyCheck(orthographyDto);
    }

    @Post('pros-cons-discusser')
    prosConsDiscusser(
      @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
    ) {
      return this.gptService.prosConsDiscusser(prosConsDiscusserDto);
    }

    @Post('pros-cons-discusser-stream')
    async prosConsDiscusserStream(
      @Body() prosConsDiscusserDto: ProsConsDiscusserDto,
      @Res() res: Response,
    ) {
      const stream = await this.gptService.prosConsDiscusserStream(prosConsDiscusserDto);
      res.setHeader('Content-Type', 'application/json');
      res.status( HttpStatus.OK );

      for await (const chunk of stream) {
        const piece = chunk.choices[0].delta.content || '';
        res.write(piece);
      }

      res.end();
    }

    @Post('translate')
    languageTranslator(
      @Body() translatorDTO: TranslatorDTO,
    ) {
      return this.gptService.languageTranslator(translatorDTO);
    }

    @Post('text-to-audio')
    async textToAudio(
      @Body() textToAudioDTO: TextToAudioDTO,
      @Res() res: Response,
      ) {
      const filePath = await this.gptService.textToAudio(textToAudioDTO);

      res.setHeader('Content-type', 'audio/mp3');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    }

    @Get('get-audio/:fileId')
    async textToAudioGetter(
      @Param('fileId') fileId: string,
      @Res() res: Response,
      ) {
      const filePath = await this.gptService.getAudio(fileId);
      
      res.setHeader('Content-type', 'audio/mp3');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    }
  
}
