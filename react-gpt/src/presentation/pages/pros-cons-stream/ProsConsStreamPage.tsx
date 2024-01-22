import { prosConsSteamGeneratorUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from "../../components";
import { useState, useRef } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
}

export const ProsConsStreamPage = () => {

  const abortController = useRef( new AbortController() );
  const isRunning = useRef( false );

  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }
    setIsloading(true);
    isRunning.current = true;
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
     const stream = prosConsSteamGeneratorUseCase( text, abortController.current.signal );
     setIsloading(false);
     setMessages( (messages) => [ ...messages, { text: '', isGpt: true } ] );
     for await (const text of stream) {
      setMessages( (messages) => {
        const newMessages = [ ...messages ];
        newMessages[ newMessages.length - 1 ].text = text;
        return newMessages;
      } );
      
     
    //const reader = await prosConsSteamUseCase(text);
    
    //setIsloading(false);
    
    //Generar el mensaje
    //if ( !reader) {
    //  return setMessages((prev) => [...prev, { text: "No se pudo generar el mensaje", isGpt: true }]);
    //}

    //const decoder = new TextDecoder();
    //let message = '';
    //setMessages( (messages) => [ ...messages, { text: message, isGpt: true } ] );

    //while (true) {
    //  const { done, value } = await reader.read();
    //  if (done) break;

    //  const decodedChunk = decoder.decode( value, { stream: true } );
    //  message += decodedChunk;
    //  setMessages( (messages) => {
    //    const newMessages = [ ...messages ];
    //    newMessages[ newMessages.length - 1 ].text = message;
    //    return newMessages;
    //  } );
    }

    isRunning.current = false;
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="¿Qué deseas comparar hoy?" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptMessage key={ index } text={message.text} />
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

