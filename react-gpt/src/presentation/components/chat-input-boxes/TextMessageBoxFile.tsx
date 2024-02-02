import { useRef, useState } from 'react';

interface Props {
    onSendMessage: (message: string, file: File) => void;
    placeholder?: string;
    disableCorrections?: boolean;
    accept?: string;
}

export const TextMessageBoxFile = ({ onSendMessage, placeholder, disableCorrections = false, accept}: Props) => {
    
    const [message, setMessage] = useState('');

    const [selectedFile, setSelectedFile] = useState<File | null>();
    const inpuntFileRef = useRef<HTMLInputElement>(null);
  
    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        //if (message.trim().length === 0) return;
        if ( !selectedFile ) return;
        onSendMessage( message, selectedFile);
        setMessage('');
        setSelectedFile(null);
    }
    return (
    <form
    onSubmit={ handleSendMessage }
    className="flex flex-row w-full h-16 px-4 items-center justify-center rounded-xl bg-white shadow-md"
    >

    <div className="mr-3">
        <button 
            type="button"
            className="flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={ () => inpuntFileRef.current?.click() }
            >
            <i className="fa-solid fa-paperclip text-xl"></i>
        </button>

        <input
            type="file"
            ref={ inpuntFileRef}
            accept={ accept }
            onChange={ (event) => setSelectedFile(event.target.files?.item(0))}
            hidden
        />
    </div>    



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
            {
               ( !selectedFile )
                ? <span className="mr-2">Enviar</span>
                : <span className="mr-2">{ selectedFile.name.substring(0,10) + '...' } </span> 
            }
            <i className="fa-regular fa-paper-plane"></i>
        </button>
     </div>

    </form>
  )
}