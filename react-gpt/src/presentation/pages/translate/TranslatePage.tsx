import { translateTextUserCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect } from "../../components";
import { useState } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "coreano", text: "Coreano" },
  { id: "francés", text: "Francés" },
  { id: "griego", text: "Griego" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "italiano", text: "Italiano" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "neerlandés", text: "Neerlandés" },
  { id: "polaco", text: "Polaco" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
  { id: "sueco", text: "Sueco" },
  { id: "turco", text: "Turco" },
];

export const TranslatePage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string, selectedOption: string) => {
    setIsloading(true);

    const newMessage = `Traduciendo "${text}" al idioma ${selectedOption}...`
    setMessages((prev) => [...prev, { text: newMessage, isGpt: false }]);
    
    //Use Case
    const { ok, message } = await translateTextUserCase(text, selectedOption);
    setIsloading(false);
    if (!ok) {
      setMessages((prev) => [...prev, { text: "No se pudo procesar la traducción", isGpt: true }]);
    } else {
      setMessages((prev) => [...prev, { text: message, isGpt: true }]);
    }
    
    
    
    //Mensaje isGPT = true
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="Hola, puedes escribir palabras o textos y te ayudo a traducirlo" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptMessage key={ index } text={ message.text } />
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

      <TextMessageBoxSelect 
            onSendMessage={ handlePost }
            placeholder="Escribe algo..."
            options={ languages }
          />
    </div>
  )
}