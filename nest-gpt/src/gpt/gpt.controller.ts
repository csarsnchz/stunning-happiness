import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, NotFoundException, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDiscusserDto, TranslatorDTO, TextToAudioDTO, AudioToTextDto, ImageGenerationDTO } from './dtos';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

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

    @Post('audio-to-text')
    @UseInterceptors( 
      FileInterceptor('file', { 
        storage: diskStorage({
          destination: './generated/uploads',
          filename: (req, file, cb) => {
            const fileExtension = file.originalname.split('.').pop();
            const filename = `${ new Date().getTime() }.${fileExtension}`;
            return cb(null, filename);
          }
          })
        })
      )
    async audioToText(
        @UploadedFile( 
          new ParseFilePipe({
            validators:  [
                new MaxFileSizeValidator( { maxSize: 1000 * 1024 * 5, message: 'File is bigger than 5 MB' } ),
                new FileTypeValidator( { fileType: 'audio/*' } )
            ]
          }) 
        ) file: Express.Multer.File,
        @Body() audioToTextDto: AudioToTextDto,
      ) {
      return await this.gptService.audioToText({ audioFile: file, audioToTextDto });
    }

    @Post('image-generation')
    async imageGeneration(
      @Body() imageGenerationDTO: ImageGenerationDTO,
      @Res() res: Response,
      ) {
      const image = await this.gptService.imageGeneration(imageGenerationDTO);
      const {url, localPath, revised_prompt} = image;
      if (!url) throw new NotFoundException('Image not found');
      res.setHeader('Content-type', 'image/png');
      res.status(HttpStatus.OK);
      res.sendFile(url);
    }

    @Get('image-generation/:filename')
    async getImage(
      @Param('filename') filename: string,
      @Res() res: Response,
      ) {
      const filePath = await this.gptService.getImage(filename);
      res.setHeader('Content-type', 'image/png');
      res.status(HttpStatus.OK);
      res.sendFile(filePath);
    }
  
}
