
/**
 * Orthography Check Use Case
 * @returns {Object} - Object with the result of the operation
 */

interface Options {
    prompt: string;
}

export const orthographyCheckUseCase = async( options: Options) => {
    
    const { prompt } = options;
    
    return { 
        prompt: prompt
    };
}