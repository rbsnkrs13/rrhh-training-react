import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SidebarConversaciones from '@/Components/Admin/Chat/SidebarConversaciones';
import PanelConversacion from '@/Components/Admin/Chat/PanelConversacion';
import useChat from '@/Hooks/useChat';

export default function Mensajes() {
    const [conversacionActiva, setConversacionActiva] = useState<number | null>(null);
    const {
        conversaciones,
        mensajes,
        cargarConversaciones,
        cargarMensajes,
        enviarMensaje
    } = useChat();

    // Cargar conversaciones al montar
    useEffect(() => {
        cargarConversaciones();
    }, [cargarConversaciones]);

    // Cargar mensajes cuando se selecciona una conversación
    const handleSeleccionarConversacion = (empleadoId: number) => {
        setConversacionActiva(empleadoId);
        cargarMensajes(empleadoId);
    };

    // Enviar mensaje
    const handleEnviarMensaje = async (mensaje: string) => {
        if (!conversacionActiva) return;

        try {
            await enviarMensaje(conversacionActiva, mensaje);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    };

    // Obtener info del empleado seleccionado
    const empleadoSeleccionado = conversacionActiva
        ? conversaciones.find(conv => conv.empleadoId === conversacionActiva)
        : null;

    // Transformar a formato esperado por PanelConversacion
    const empleadoInfo = empleadoSeleccionado
        ? {
            id: empleadoSeleccionado.empleadoId,
            nombre: empleadoSeleccionado.nombre,
            email: '', // No lo tenemos en la conversación, podrías agregarlo si es necesario
        }
        : null;

    return (
        <AuthenticatedLayout hideChat>
            <Head title="Mensajes" />

            <div className="fixed inset-0 top-16 flex overflow-hidden">
                <SidebarConversaciones
                    conversaciones={conversaciones}
                    conversacionActiva={conversacionActiva}
                    onSeleccionarConversacion={handleSeleccionarConversacion}
                />

                <PanelConversacion
                    empleadoSeleccionado={empleadoInfo}
                    mensajes={mensajes}
                    onEnviarMensaje={handleEnviarMensaje}
                />
            </div>
        </AuthenticatedLayout>
    );
}
