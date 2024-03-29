import { imageGenerationUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox, GptMessageImage } from "../../components";
import { useState } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  }
}

export const ImageGenerationPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
    const imageInfo = await imageGenerationUseCase(text);
    
    setIsloading(false);
    
    if (!imageInfo) {
       return setMessages((prev) => [...prev, { text: "No se pudo generar la imagen", isGpt: true }]);
    }

    setMessages((prev) => [...prev, { text: text, isGpt: true, info: {imageUrl: imageInfo.imageUrl, alt: imageInfo.alt} }]);
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="Qué imagen deseas generar?" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptMessageImage key={ index } text={message.text} imageUrl={message.info?.imageUrl!} alt={message.info?.alt!}/>
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
  )
}