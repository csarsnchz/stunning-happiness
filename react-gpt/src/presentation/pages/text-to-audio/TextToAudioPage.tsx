import { textToAudioUseCase } from "../../../core/use-cases";
import { GptMessage, MyMessage, TypingLoader, TextMessageBoxSelect, GptMessageAudio } from "../../components";
import { useState } from 'react';

const disclaimer = `## Hola, puedes escribir un texto y generaré un audio en formato mp3 de salida.
* El audio generado no es almacenado y es generado en tiempo real por IA.
`

const voices = [
  { id: "nova", text: "Nova" },
  { id: "alloy", text: "Alloy" },
  { id: "echo", text: "Echo" },
  { id: "fable", text: "Fable" },
  { id: "onyx", text: "Onyx" },
  { id: "shimmer", text: "Shimmer" },
];

interface TextMessage {
  text: string;
  isGpt: boolean;
  type: 'text';
}

interface AudioMessage {
  text: string;
  isGpt: boolean;
  audio: string;
  type: 'audio';
}

type Message = TextMessage | AudioMessage;

export const TextToAudioPage = () => {
  const [isloading, setIsloading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const handlePost = async (text: string, selectedVoice: string) => {
    setIsloading(true);
    setMessages((prev) => [...prev, { text: text, isGpt: false, type: 'text'}]);
    
    //Use Case
    const { ok, message, audioUrl } = await textToAudioUseCase(text, selectedVoice);
    setIsloading(false);
    
    if(!ok) {
      console.log(message);
      return;
    }

    setMessages((prev) => [...prev, { text:`${selectedVoice} - ${message}`, isGpt: true, audio: audioUrl!, type: 'audio'}]);
    //Mensaje isGPT = true
  }
  
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text={disclaimer} />
          
            { 
              messages.map( (message, index) => (
                message.isGpt 
                ? (
                    message.type === 'audio'
                    ? (
                      <GptMessageAudio key={ index } text={message.text} audioUrl={message.audio} />
                    ):(
                      <GptMessage key={ index } text={message.text} />
                      )          
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
            options={ voices }
          />
    </div>
  )
}