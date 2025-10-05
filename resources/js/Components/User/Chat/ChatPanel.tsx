import React, { useEffect, useRef } from 'react';
import HeaderChat from '@/Components/Shared/Chat/HeaderChat';
import BurbujaMensaje from '@/Components/Shared/Chat/BurbujaMensaje';
import InputMensaje from '@/Components/Shared/Chat/InputMensaje';

interface Mensaje {
    id: number;
    mensaje: string;
    hora: string;
    esPropio: boolean;
    nombreRemitente?: string;
}

interface ChatPanelProps {
    isOpen: boolean;
    onCerrar: () => void;
    mensajes?: Mensaje[];
    onEnviarMensaje: (mensaje: string) => void;
}

export default function ChatPanel({
    isOpen,
    onCerrar,
    mensajes = [],
    onEnviarMensaje
}: ChatPanelProps) {
    const mensajesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [mensajes, isOpen]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity"
                    onClick={onCerrar}
                />
            )}

            {/* Panel deslizable */}
            <div
                className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <HeaderChat
                        titulo="Chat con Administración"
                        subtitulo="Respuesta en menos de 24h"
                        onCerrar={onCerrar}
                    />

                    {/* Mensajes */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                        {mensajes.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-gray-400">
                                <p>No hay mensajes aún. ¡Inicia la conversación!</p>
                            </div>
                        ) : (
                            <>
                                {mensajes.map((msg) => (
                                    <BurbujaMensaje
                                        key={msg.id}
                                        mensaje={msg.mensaje}
                                        hora={msg.hora}
                                        esPropio={msg.esPropio}
                                        nombreRemitente={msg.nombreRemitente}
                                    />
                                ))}
                                <div ref={mensajesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Input */}
                    <InputMensaje
                        onEnviar={onEnviarMensaje}
                        placeholder="Escribe tu consulta..."
                    />
                </div>
            </div>
        </>
    );
}
