import OpenAI from 'openai';
import { json } from 'stream/consumers';

/**
 * Orthography Check Use Case
 * @returns {Object} - Object with the result of the operation
 */

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( openai: OpenAI, options: Options) => {
    
    const { prompt } = options;

    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Eres un corrector ortográfico y gramatical. 
                    Se ingresará un texto en español con posibles errores ortográficos y gramaticales,
                    deberás generar tu respuesta en formato JSON y validar que cada palabra exista en el diccionario de la Real Academia Española.
                    Tu tarea es corregir los errores ortográficos y gramaticales del texto y retornar la solución con la corrección realizada.
                    También deberás retornar la cantidad de errores ortográficos y gramaticales que encontraste en porcentaje del total del texto ingresado.

                    Si en el texto proporcionado no existen errores, debes retornar un mensaje de felicitaciones indicando que no existen errores.

                    Ejemplo de respuesta:
                    {
                        userScore: number, // 'Calificación del usuario, basado en la cantidad de errores encontrados. En una escala de 0 a 100. Entre más errores, menor calificación.'
                        "errors": string[], // ['error -> solución']
                        "message": string, // 'Si no hay errores, felicítalo por su texto. Si el porcentaje de error es mayor a 0% indicar que debe revisar su texto. Usa emojis con el mensaje de respuesta'
                        "errorPercentage": string // 'Porcentaje de errores encontrados en el texto.'
                    }

                    `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 150,
        response_format: {
            type: 'json_object'
        }
      });
    
      const jsonResp = JSON.parse(completion.choices[0].message.content);
    
    return jsonResp;
}