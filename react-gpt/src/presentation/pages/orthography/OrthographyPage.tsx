import { orthographyUseCase } from "../../../core/use-cases";
import { GptMessage, GptOrthographyMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect } from "../../components";
import { useState }from 'react';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    userScore: number;
    errors: string[];
    message: string;
    errorPercentage: string;
  }
}

export const OrthographyPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
    const { ok, errors, message, userScore, errorPercentage } = await orthographyUseCase(text);
    if (!ok) {
      setMessages((prev) => [...prev, { text: "No se pudo procesar la corrección", isGpt: true }]);
    } else {
      setMessages((prev) => [...prev, { 
        text: message, isGpt: true, 
        info: { userScore, errors, message, errorPercentage }
       }]);
    }

    setIsloading(false);
    
    //Mensaje isGPT = true
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="Hola, puedes escribir palabras en español, y te ayudo con las correcciones" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptOrthographyMessage 
                    key={ index }
                    { ...message.info! }  
                    />
                  /* errors= { message.info!.errors }
                    message= { message.info!.message }
                    userScore= { message.info!.userScore }
                    errorPercentage= { message.info!.errorPercentage } */
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
{/*      <TextMessageBoxFile 
            onSendMessage={ handlePost }
            placeholder="Escribe algo..."
        />*/}
{/*        <TextMessageBoxSelect
            options={ [{ id: '1', text: 'Hola' }, { id: '2', text: 'Mundo' }] }
            onSendMessage={ handlePost }
            placeholder="Escribe algo..."
      /> */}  
    </div>
  )
}