import React from 'react';

interface ConversacionItemProps {
    empleadoId: number;
    nombre: string;
    ultimoMensaje: string;
    horaUltimoMensaje: string;
    mensajesNoLeidos: number;
    activo: boolean;
    onClick: () => void;
}

export default function ConversacionItem({
    nombre,
    ultimoMensaje,
    horaUltimoMensaje,
    mensajesNoLeidos,
    activo,
    onClick
}: ConversacionItemProps) {
    return (
        <button
            onClick={onClick}
            className={`w-full border-b border-gray-200 p-4 text-left transition-colors hover:bg-gray-50 ${
                activo ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm truncate ${activo ? 'text-blue-600' : 'text-gray-900'}`}>
                            {nombre}
                        </h4>
                        {mensajesNoLeidos > 0 && (
                            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">
                                {mensajesNoLeidos}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{ultimoMensaje}</p>
                </div>
                <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">{horaUltimoMensaje}</span>
            </div>
        </button>
    );
}
