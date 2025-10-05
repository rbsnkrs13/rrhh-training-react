import React from 'react';
import { MessageCircle } from 'lucide-react';

interface ChatButtonUserProps {
    onClick: () => void;
    mensajesNoLeidos?: number;
}

export default function ChatButtonUser({ onClick, mensajesNoLeidos = 0 }: ChatButtonUserProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Abrir chat"
        >
            <MessageCircle className="h-6 w-6" />
            {mensajesNoLeidos > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                    {mensajesNoLeidos > 9 ? '9+' : mensajesNoLeidos}
                </span>
            )}
        </button>
    );
}
