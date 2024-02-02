import { AudioToTextResponse, OrthographyResponse } from "../../interfaces";

export const audioToTextUseCaseseCase = async ( audioFile: File, prompt?: string) => {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        if (prompt) {
            formData.append('prompt', prompt);
        }
        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/audio-to-text`, {
            method: 'POST',
            body: formData
        });
        if (!resp.ok) throw new Error("Error al procesar la solicitud");
        const data = await resp.json() as AudioToTextResponse;
        console.log(data);
        return {
            ok: true,
            ...data,
        }

        
    } catch (error) {
        console.log(error);
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'Error no se pudo procesar la solicitud'
        }
    }
}