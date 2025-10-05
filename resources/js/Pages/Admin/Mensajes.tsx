import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import SidebarConversaciones from '@/Components/Admin/Chat/SidebarConversaciones';
import PanelConversacion from '@/Components/Admin/Chat/PanelConversacion';

// Datos de ejemplo (luego vendrán del backend)
const conversacionesEjemplo = [
    {
        empleadoId: 1,
        nombre: 'Juan Pérez',
        ultimoMensaje: 'No puedo descargar mi nómina de diciembre',
        horaUltimoMensaje: '10:30',
        mensajesNoLeidos: 2
    },
    {
        empleadoId: 2,
        nombre: 'María García',
        ultimoMensaje: 'Gracias por la ayuda',
        horaUltimoMensaje: 'Ayer',
        mensajesNoLeidos: 0
    },
    {
        empleadoId: 3,
        nombre: 'Carlos López',
        ultimoMensaje: '¿Cómo puedo fichar desde casa?',
        horaUltimoMensaje: '2 días',
        mensajesNoLeidos: 1
    }
];

const mensajesEjemplo: Record<number, any[]> = {
    1: [
        { id: 1, mensaje: 'Hola, tengo un problema con mi nómina', hora: '10:25', esPropio: false, nombreRemitente: 'Juan Pérez' },
        { id: 2, mensaje: 'No puedo descargar mi nómina de diciembre', hora: '10:30', esPropio: false, nombreRemitente: 'Juan Pérez' },
    ],
    2: [
        { id: 3, mensaje: '¿Podrías ayudarme con el fichaje?', hora: 'Ayer 15:20', esPropio: false, nombreRemitente: 'María García' },
        { id: 4, mensaje: 'Claro, ¿qué necesitas?', hora: 'Ayer 15:25', esPropio: true },
        { id: 5, mensaje: 'Gracias por la ayuda', hora: 'Ayer 16:00', esPropio: false, nombreRemitente: 'María García' },
    ],
    3: [
        { id: 6, mensaje: '¿Cómo puedo fichar desde casa?', hora: 'Hace 2 días', esPropio: false, nombreRemitente: 'Carlos López' },
    ]
};

const empleadosInfo: Record<number, any> = {
    1: { id: 1, nombre: 'Juan Pérez', email: 'juan@empresa.com' },
    2: { id: 2, nombre: 'María García', email: 'maria@empresa.com' },
    3: { id: 3, nombre: 'Carlos López', email: 'carlos@empresa.com' },
};

export default function Mensajes() {
    const [conversacionActiva, setConversacionActiva] = useState<number | null>(null);

    const handleSeleccionarConversacion = (empleadoId: number) => {
        setConversacionActiva(empleadoId);
    };

    const handleEnviarMensaje = (mensaje: string) => {
        console.log('Enviar mensaje:', mensaje, 'a empleado:', conversacionActiva);
        // Aquí irá la lógica de envío con WebSocket/Reverb
    };

    const empleadoSeleccionado = conversacionActiva ? empleadosInfo[conversacionActiva] : null;
    const mensajesActuales = conversacionActiva ? (mensajesEjemplo[conversacionActiva] || []) : [];

    return (
        <AuthenticatedLayout hideChat>
            <Head title="Mensajes" />

            <div className="fixed inset-0 top-16 flex overflow-hidden">
                <SidebarConversaciones
                    conversaciones={conversacionesEjemplo}
                    conversacionActiva={conversacionActiva}
                    onSeleccionarConversacion={handleSeleccionarConversacion}
                />

                <PanelConversacion
                    empleadoSeleccionado={empleadoSeleccionado}
                    mensajes={mensajesActuales}
                    onEnviarMensaje={handleEnviarMensaje}
                />
            </div>
        </AuthenticatedLayout>
    );
}
