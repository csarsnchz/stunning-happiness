import OpenAI from 'openai';
import { json } from 'stream/consumers';

/**
 * Orthography Check Use Case
 * @returns {Object} - Object with the result of the operation
 */

interface Options {
    prompt: string;
    lang: string;
}

export const translateUseCase = async( openai: OpenAI, { prompt, lang }: Options) => {
    
    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Eres un traductor experto en todos los idiomas. 
                    Se ingresará un texto en cualquier idioma y deberás generar una respuesta en el idioma indicado.
                    Deberás generar tu respuesta en formato markdown.
                    Tu tarea es traducir el siguiente texto al idioma ${lang}:${prompt}.
                    
                    Si el idioma ${lang} no existe, deberás retornar un mensaje de error indicando que el idioma no existe.

                    `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo",
        temperature: 0.3,
        max_tokens: 1500,
      });
    
      const jsonResp = JSON.parse(completion.choices[0].message.content);
    
    return jsonResp;
}