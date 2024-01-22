import OpenAI from 'openai';

/**
 * Orthography Check Use Case
 * @returns {Object} - Object with the result of the operation
 */

interface Options {
    prompt: string;
}

export const prosConsDiscusserUseCase = async( openai: OpenAI, { prompt }: Options) => {
    
    
    const completion = await openai.chat.completions.create({
        messages: [
            { 
                role: "system", 
                content: `
                    Eres un experto en la búsqueda de pros y contras de un tema específico. 
                    Se ingresará una pregunta y deberás generar una respuesta con los pros y contras del tema ingresado en la pregunta.
                    Deberás generar tu respuesta en formato markdown.
                    Tu tarea es mostrar los pros y contras en una lista.
                    También deberás retornar la cantidad de pros y contras que encontraste en el texto ingresado.                    
                    
                        
                    `
            },
            {
                role: "user",
                content: prompt
            }
        ],
        model: "gpt-3.5-turbo-1106",
        temperature: 0.3,
        max_tokens: 1500,

      });
    
    return completion.choices[0].message;
}