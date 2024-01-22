
export async function* prosConsSteamGeneratorUseCase ( prompt: string, abortSignal: AbortSignal ) {
    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/pros-cons-discusser-stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt }),
            // TODO abortSignal
            signal: abortSignal,
        });
        
        if (!resp.ok) throw new Error("No se pudo realizar la comparación");
         
        const reader = resp.body?.getReader();
        if (!reader) {
            throw new Error("No se pudo generar la comparación");
        }
        
        const decoder = new TextDecoder();
        let text ='';

         while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            const decodedChunk = decoder.decode( value, { stream: true } );
            text += decodedChunk;
            yield text;
        }

    } catch (error) {
        return null;
    }
}