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

interface PanelConversacionProps {
    empleadoSeleccionado: {
        id: number;
        nombre: string;
        email: string;
    } | null;
    mensajes: Mensaje[];
    onEnviarMensaje: (mensaje: string) => void;
}

export default function PanelConversacion({
    empleadoSeleccionado,
    mensajes,
    onEnviarMensaje
}: PanelConversacionProps) {
    const mensajesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (empleadoSeleccionado) {
            scrollToBottom();
        }
    }, [mensajes, empleadoSeleccionado]);

    if (!empleadoSeleccionado) {
        return (
            <div className="flex h-full flex-1 items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-lg text-gray-400">Selecciona una conversación</p>
                    <p className="mt-2 text-sm text-gray-300">
                        Elige un empleado de la lista para ver sus mensajes
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-full flex-1 flex-col">
            {/* Header */}
            <HeaderChat
                titulo={empleadoSeleccionado.nombre}
                subtitulo={empleadoSeleccionado.email}
            />

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
                {mensajes.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <p>No hay mensajes con este empleado</p>
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
                placeholder={`Responder a ${empleadoSeleccionado.nombre}...`}
            />
        </div>
    );
}
