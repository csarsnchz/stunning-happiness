import { audioToTextUseCaseseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxFile } from "../../components";
import { useState } from 'react';

interface Message {
  text: string;
  isGpt: boolean;
}

export const AudioToTextPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string, audioFile: File) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false }]);
    
    //Use Case
    const resp = await audioToTextUseCaseseCase(audioFile, text);
    setIsloading(false);
    
    if (!resp) return;
    const gptMessage = `
## Transcripción de audio a texto
__Duration:__ ${Math.round(resp.duration)} segundos
### El texto generado a partir del audio es: 
${resp.text}`;

    setMessages((prev) => [
      ...prev, 
      { text: gptMessage, isGpt: true }
    ]);

    for( const segment of resp.segments ) {
      const segmentMessage = `segments
__De ${ Math.round( segment.start ) } a ${ Math.round( segment.end ) } segundos:__
${ segment.text }
`

      setMessages( (prev) => [
        ...prev,
        { text: segmentMessage, isGpt: true }
      ]);
    }

  
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="Qué texto de audio quieres generar hoy.?" />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                  <GptMessage key={ index } text={message.text} />
                )
                : (
                  <MyMessage key={ index } text={ (message.text === '')?'Transcribe el audio': message.text } />
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

      <TextMessageBoxFile
            onSendMessage={ handlePost }
            placeholder="Escribe algo..."
            accept="audio/*"
          />
    </div>
  )
}