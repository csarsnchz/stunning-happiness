import { imageGenerationUseCase, imageVariationUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage, GptMessageSelectedImage } from "../../components";
import { useState } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageTunningPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: "Imagen base para generar variante",
      info: {
        imageUrl: "http://localhost:3000/gpt/image-generation/1707708434475.png",
        alt: "Imagen base"
      }
    }
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    originalImage: undefined as string | undefined,
    maskImage: undefined as string | undefined
  });

  const handleVariation = async () => {
    setIsloading(true);
    const image = await imageVariationUseCase(originalImageAndMask.originalImage!);
    setIsloading(false);
    if (!image) {
      return;
    }
    setMessages((prev) => [
      ...prev, 
        {
          text: "Variante generada",
          isGpt: true,
          info: {
            imageUrl: image.imageUrl,
            alt: image.alt
          }
        }]);
  }
  
  const handlePost = async (text: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    const {originalImage, maskImage} = originalImageAndMask
    //Use Case
    const imageInfo = await imageGenerationUseCase(text, originalImage, maskImage);
    
    setIsloading(false);
    
    if (!imageInfo) {
       return setMessages((prev) => [...prev, { text: "No se pudo generar la imagen", isGpt: true }]);
    }

    setMessages((prev) => [...prev, { text: text, isGpt: true, info: {imageUrl: imageInfo.imageUrl, alt: imageInfo.alt} }]);
  }
  
  return (
    <>
      {
        originalImageAndMask.originalImage && (
          <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
            <img src={originalImageAndMask.maskImage ?? originalImageAndMask.originalImage} alt="Imagen Original" className="border rounded-xl w-36 h-36 object-contain" />
            <button onClick={handleVariation} className="btn-primary mt-2">Generar Variante</button>
          </div>
        )
      }  
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            {/*Bienvenida*/}
            <GptMessage text="Qué imagen deseas generar?" />
            
              { 
                messages.map( (message, index) => (
                  message.isGpt 
                  ? (
                    <GptMessageSelectedImage key={ index } text={message.text} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!} onImageSelected={(maskImageUrl) => setOriginalImageAndMask({originalImage: message.info?.imageUrl, maskImage: maskImageUrl})}/>
                  )
                  : (
                    <MyMessage key={ index } text={message.text} />
                  )
                ))
              }
              {
                isloading && (
                <div className="col-start-1 col-end-12 fade-in">
                  <TypingLoader />
                </div>
                )
              }

          </div>
        </div>

        <TextMessageBox 
              onSendMessage={ handlePost }
              placeholder="Escribe algo..."
              disableCorrections={ true }
            />
      </div>
    </>  
  )
}