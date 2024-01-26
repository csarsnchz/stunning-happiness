/**
 * Converts text to audio using the specified prompt and voice.
 * @param prompt - The text to be converted to audio.
 * @param voice - The voice to be used for the audio conversion.
 * @returns An object with the result of the audio conversion.
 *          - ok: A boolean indicating if the conversion was successful.
 *          - message: The original prompt text.
 *          - audioUrl: The URL of the generated audio file.
 *          If an error occurs during the conversion, the object will have ok: false and a message describing the error.
 */
export const textToAudioUseCase = async (prompt: string, voice: string) => {
    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/text-to-audiok`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt, voice})
        });
        
        if (!resp.ok) throw new Error("No se pudo generar el audio.");
         
        const audioFIle = await resp.blob();

        const audioUrl = URL.createObjectURL(audioFIle);

        return {
            ok: true,
            message: prompt,
            audioUrl,
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Error no se pudo procesar la solicitud',
        }
    }
}