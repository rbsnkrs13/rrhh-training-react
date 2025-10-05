import React from 'react';

interface BurbujaMensajeProps {
    mensaje: string;
    hora: string;
    esPropio: boolean;
    nombreRemitente?: string;
}

export default function BurbujaMensaje({ mensaje, hora, esPropio, nombreRemitente }: BurbujaMensajeProps) {
    return (
        <div className={`flex ${esPropio ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[70%] ${esPropio ? 'order-2' : 'order-1'}`}>
                {!esPropio && nombreRemitente && (
                    <p className="text-xs text-gray-500 mb-1 px-1">{nombreRemitente}</p>
                )}
                <div
                    className={`rounded-2xl px-4 py-2 ${
                        esPropio
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                >
                    <p className="text-sm whitespace-pre-wrap break-words">{mensaje}</p>
                </div>
                <p className={`text-xs text-gray-400 mt-1 px-1 ${esPropio ? 'text-right' : 'text-left'}`}>
                    {hora}
                </p>
            </div>
        </div>
    );
}
