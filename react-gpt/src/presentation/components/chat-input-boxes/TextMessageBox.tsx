import { FormEvent, useState } from 'react';

interface Props {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
}

export const TextMessageBox = ({ onSendMessage, placeholder, disableCorrections = false}: Props) => {
    
    const [message, setMessage] = useState('');
  
    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim().length === 0) return;
        onSendMessage( message );
        setMessage('');
    }
    return (
    <form
    onSubmit={ handleSendMessage }
    className="flex flex-row w-full h-16 px-4 items-center justify-center rounded-xl bg-white shadow-md"
    >
     <div className="flex-grow">
        <div className="relative w-full">
            <input
                name="message"
                autoFocus
                type="text"
                placeholder={ placeholder }
                className="flex w-full border text-gray-800 rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                autoComplete={ disableCorrections ? 'on' : 'off'}
                autoCorrect={ disableCorrections ? 'on' : 'off'}
                spellCheck={ disableCorrections ? 'false' : 'true'}
                value={ message }
                onChange={ (event) => setMessage(event.target.value)}
            />
        </div>
     </div>

     <div className="ml-4">
        <button className="btn-primary">
            <span className="mr-2">Enviar</span>
            <i className="fa-regular fa-paper-plane"></i>
        </button>
     </div>

    </form>
  )
}