import { GptMessage, MyMessage, TypingLoader, TextMessageBox, TextMessageBoxFile, TextMessageBoxSelect } from "../../components";
import { useState }from 'react';

interface Message {
  text: string;
  isGpt: boolean;
}

export const OrthographyPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
    
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
                  <GptMessage key={ index } text="Esto es OpenAI" />
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