import React, { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface InputMensajeProps {
    onEnviar: (mensaje: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export default function InputMensaje({
    onEnviar,
    placeholder = 'Escribe un mensaje...',
    disabled = false
}: InputMensajeProps) {
    const [mensaje, setMensaje] = useState('');

    const handleEnviar = () => {
        if (mensaje.trim() && !disabled) {
            onEnviar(mensaje.trim());
            setMensaje('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEnviar();
        }
    };

    return (
        <div className="border-t bg-white p-4">
            <div className="flex items-end gap-2">
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 resize-none rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    style={{ maxHeight: '120px' }}
                />
                <button
                    onClick={handleEnviar}
                    disabled={!mensaje.trim() || disabled}
                    className="rounded-lg bg-blue-600 p-2.5 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
