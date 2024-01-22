import { prosConsUseCase } from "../../../core/use-cases";
import { GptMessage, GptProsConsDiscusserMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect } from "../../components";
import { useState }from 'react';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    message: string;
  }
}

export const ProsConsPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
    const { ok, message } = await prosConsUseCase(text);
    if (!ok) {
      setMessages((prev) => [...prev, { text: "No se pudo procesar la corrección", isGpt: true }]);
    } else {
      setMessages((prev) => [...prev, { 
        text: message, isGpt: true, 
        info: { message }
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
          <GptMessage text="Hola, puedes escribir una pregunta para comparar dos productos o temas, y te ayudo listando los pros y cons" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptProsConsDiscusserMessage 
                      message={[]} key={index}
                      {...message}                    />
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