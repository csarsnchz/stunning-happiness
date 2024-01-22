import { FormEvent, useState } from 'react';

interface Props {
    onSendMessage: (message: string, selectedOption: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
    options: Option[];
}

interface Option {
    id: string;
    text: string;
}  

export const TextMessageBoxSelect = ({ onSendMessage, placeholder, disableCorrections = false, options}: Props) => {
    
    const [message, setMessage] = useState('');
    const [selectedOption, setSelectedOption] = useState<string>('');
  
    const handleSendMessage = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (message.trim().length === 0) return;
        if (selectedOption === '') return;
        
        onSendMessage( message, selectedOption );
        setMessage('');
    }
    return (
    <form
    onSubmit={ handleSendMessage }
    className="flex flex-row w-full h-16 px-4 items-center justify-center rounded-xl bg-white shadow-md"
    >
     <div className="flex-grow">
        <div className="flex">
            <input
                name="message"
                autoFocus
                type="text"
                placeholder={ placeholder }
                className="w-full border text-gray-800 rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                autoComplete={ disableCorrections ? 'on' : 'off'}
                autoCorrect={ disableCorrections ? 'on' : 'off'}
                spellCheck={ disableCorrections ? 'false' : 'true'}
                value={ message }
                onChange={ (event) => setMessage(event.target.value)}
            />

            <select name="select"
                className="w-2/5 border rounded-xl text-gray-800 focus:outline-none focus:border-indigo-300 pl-4 h-10"
                value={ selectedOption }
                onChange={ event => setSelectedOption(event.target.value) }
            >
                <option value="">Seleccione</option>
                {options.map(({ id, text }) => (
                    <option key={ id } value={ id }>{ text }</option>
                )
                )}

            </select>
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