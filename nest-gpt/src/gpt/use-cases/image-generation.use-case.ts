import * as fs from 'fs';

import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options {
    prompt: string;
    originalimage?: string;
    maskImage?: string;
    }

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, originalimage, maskImage } = options;
  
  if (!originalimage || !maskImage) {
    const response = await openai.images.generate({
        prompt: prompt,
        model: 'dall-e-2',
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        response_format: 'url'
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;

    return {
        url: url,
        OpenAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    };
  }

    const pngImagePath = await downloadImageAsPng(originalimage, true);
    const maskImagePath = await downloadBase64ImageAsPng(maskImage, true);

    const response = await openai.images.edit({
        model: 'dall-e-2',
        prompt: prompt,
        image: fs.createReadStream(pngImagePath),
        mask: fs.createReadStream(maskImagePath),
        n: 1,
        size: '1024x1024',
        response_format: 'url' 
    });

    const fileName = await downloadImageAsPng(response.data[0].url);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${fileName}`;
    
    return {
        url: url,
        OpenAIUrl: response.data[0].url,
        revised_prompt: response.data[0].revised_prompt
    };
}