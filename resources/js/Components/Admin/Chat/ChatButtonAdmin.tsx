import React from 'react';
import { Link } from '@inertiajs/react';
import { MessageSquare } from 'lucide-react';

interface ChatButtonAdminProps {
    mensajesNoLeidos?: number;
}

export default function ChatButtonAdmin({ mensajesNoLeidos = 0 }: ChatButtonAdminProps) {
    return (
        <Link
            href={route('admin.mensajes.index')}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Ver mensajes"
        >
            <MessageSquare className="h-6 w-6" />
            {mensajesNoLeidos > 0 && (
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold">
                    {mensajesNoLeidos > 99 ? '99+' : mensajesNoLeidos}
                </span>
            )}
        </Link>
    );
}
