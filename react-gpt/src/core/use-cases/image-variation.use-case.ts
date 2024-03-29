type GeneratedImage = Image | null;

interface Image {
    imageUrl: string;
    alt: string;

}

export const imageVariationUseCase = async (originalImage: string): Promise<GeneratedImage> => {
    try {

        const resp = await fetch(`${ import.meta.env.VITE_GPT_API }/image-variation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ baseImage: originalImage})
        });
        
        if (!resp.ok) throw new Error("No se pudo generar la imagen");
         
        const {url, revise_prompt: alt} = await resp.json();
        return {
            imageUrl: url,
            alt,
        }

    } catch (error) {
        console.error(error);
        return null;
    }
}