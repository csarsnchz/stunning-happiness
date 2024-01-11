import { GptMessage, MyMessage, TypingLoader } from "../../components";

export default function OrthographyPage() {
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          {/*Bienvenida*/}
          <GptMessage text="Hola, puedes escribir palabras en español, y te ayudo con las correcciones" />

          <MyMessage text="Hola" />

          <TypingLoader className="fade-in" />
        </div>
      </div>
    </div>
  )
}