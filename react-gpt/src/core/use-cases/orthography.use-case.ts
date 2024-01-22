import { OrthographyResponse } from "../../interfaces";

export const orthographyUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/orthography-check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!resp.ok) throw new Error("Error al procesar la solicitud");
         
        const data = await resp.json() as OrthographyResponse;
        return {
            ok: true,
            ...data,
        }
    } catch (error) {
        return {
            ok: false,
            userScore: 0,
            errors: [],
            message: 'Error no se pudo procesar la solicitud',
            errorPercentage: '0%'
        }
    }
}