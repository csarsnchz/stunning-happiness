import { ProsConsDiscusserResponse } from "../../interfaces";

export const prosConsUseCase = async (prompt: string) => {
    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        if (!resp.ok) throw new Error("Error al procesar la solicitud");
         
        const data = await resp.json() as ProsConsDiscusserResponse;
        return {
            ok: true,
            ...data,
        }
    } catch (error) {
        return {
            ok: false,
            message: 'Error no se pudo procesar la solicitud'
        }
    }
}