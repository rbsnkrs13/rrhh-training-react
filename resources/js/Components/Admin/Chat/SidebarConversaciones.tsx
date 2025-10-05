import React from 'react';
import ConversacionItem from './ConversacionItem';
import { Search } from 'lucide-react';

interface Conversacion {
    empleadoId: number;
    nombre: string;
    ultimoMensaje: string;
    horaUltimoMensaje: string;
    mensajesNoLeidos: number;
}

interface SidebarConversacionesProps {
    conversaciones: Conversacion[];
    conversacionActiva: number | null;
    onSeleccionarConversacion: (empleadoId: number) => void;
}

export default function SidebarConversaciones({
    conversaciones,
    conversacionActiva,
    onSeleccionarConversacion
}: SidebarConversacionesProps) {
    const [busqueda, setBusqueda] = React.useState('');

    const conversacionesFiltradas = conversaciones.filter((conv) =>
        conv.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="flex h-full w-full flex-col border-r bg-white md:w-96">
            {/* Header */}
            <div className="border-b bg-blue-600 p-4">
                <h2 className="text-xl font-bold text-white">Mensajes</h2>
                <p className="text-sm text-blue-100">
                    {conversaciones.length} conversacion{conversaciones.length !== 1 ? 'es' : ''}
                </p>
            </div>

            {/* Búsqueda */}
            <div className="border-b p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar empleado..."
                        className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Lista de conversaciones */}
            <div className="flex-1 overflow-y-auto">
                {conversacionesFiltradas.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-gray-400">
                        <p className="text-sm">
                            {busqueda ? 'No se encontraron conversaciones' : 'No hay conversaciones'}
                        </p>
                    </div>
                ) : (
                    conversacionesFiltradas.map((conv) => (
                        <ConversacionItem
                            key={conv.empleadoId}
                            empleadoId={conv.empleadoId}
                            nombre={conv.nombre}
                            ultimoMensaje={conv.ultimoMensaje}
                            horaUltimoMensaje={conv.horaUltimoMensaje}
                            mensajesNoLeidos={conv.mensajesNoLeidos}
                            activo={conv.empleadoId === conversacionActiva}
                            onClick={() => onSeleccionarConversacion(conv.empleadoId)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
