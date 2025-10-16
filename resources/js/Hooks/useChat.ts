import { useState, useEffect, useCallback } from 'react';
import { usePage } from '@inertiajs/react';

interface Mensaje {
    id: number;
    mensaje: string;
    hora: string;
    esPropio: boolean;
    nombreRemitente?: string;
}

interface Conversacion {
    empleadoId: number;
    nombre: string;
    ultimoMensaje: string;
    horaUltimoMensaje: string;
    mensajesNoLeidos: number;
}

interface UseChatReturn {
    mensajes: Mensaje[];
    conversaciones: Conversacion[];
    mensajesNoLeidos: number;
    cargando: boolean;
    cargarConversaciones: () => Promise<void>;
    cargarMensajes: (userId: number) => Promise<void>;
    enviarMensaje: (receiverId: number, mensaje: string) => Promise<void>;
    suscribirseAMensajes: () => void;
    desuscribirseAMensajes: () => void;
}

export default function useChat(): UseChatReturn {
    const { auth } = usePage().props as any;
    const userId = auth?.user?.id;

    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
    const [mensajesNoLeidos, setMensajesNoLeidos] = useState<number>(0);
    const [cargando, setCargando] = useState<boolean>(false);

    /**
     * Cargar lista de conversaciones
     */
    const cargarConversaciones = useCallback(async () => {
        try {
            setCargando(true);
            const response = await window.axios.get('/api/messages/conversations');
            setConversaciones(response.data);
        } catch (error) {
            console.error('Error cargando conversaciones:', error);
        } finally {
            setCargando(false);
        }
    }, []);

    /**
     * Cargar mensajes de una conversación específica
     */
    const cargarMensajes = useCallback(async (otherUserId: number) => {
        try {
            setCargando(true);
            const response = await window.axios.get(`/api/messages/messages/${otherUserId}`);
            setMensajes(response.data);
        } catch (error) {
            console.error('Error cargando mensajes:', error);
        } finally {
            setCargando(false);
        }
    }, []);

    /**
     * Enviar un mensaje
     */
    const enviarMensaje = useCallback(async (receiverId: number, mensaje: string) => {
        try {
            const response = await window.axios.post('/api/messages/send', {
                receiver_id: receiverId,
                message: mensaje,
            });

            // Agregar mensaje a la lista local inmediatamente (optimistic update)
            if (response.data.success) {
                setMensajes((prev) => [...prev, response.data.message]);
            }
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            throw error;
        }
    }, []);

    /**
     * Obtener contador de mensajes no leídos
     */
    const cargarContadorNoLeidos = useCallback(async () => {
        try {
            const response = await window.axios.get('/api/messages/unread-count');
            setMensajesNoLeidos(response.data.count);
        } catch (error) {
            console.error('Error cargando contador no leídos:', error);
        }
    }, []);

    /**
     * Suscribirse al canal privado para recibir mensajes en tiempo real
     */
    const suscribirseAMensajes = useCallback(() => {
        if (!userId || !window.Echo) {
            return;
        }

        // Desuscribirse primero para evitar listeners duplicados
        window.Echo.leave(`chat.${userId}`);

        // Suscribirse al canal privado del usuario actual
        window.Echo.private(`chat.${userId}`)
            .listen('.message.sent', (event: any) => {
                // Agregar mensaje a la lista
                const nuevoMensaje: Mensaje = {
                    id: event.id,
                    mensaje: event.message,
                    hora: new Date(event.created_at).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    esPropio: false,
                    nombreRemitente: event.sender?.name,
                };

                // Agregar mensaje evitando duplicados
                setMensajes((prev) => {
                    const existe = prev.some(m => m.id === nuevoMensaje.id);
                    if (existe) return prev;

                    return [...prev, nuevoMensaje];
                });

                // Actualizar contador de no leídos
                setMensajesNoLeidos((prev) => prev + 1);

                // Recargar conversaciones para actualizar "último mensaje"
                cargarConversaciones();
            });
    }, [userId, cargarConversaciones]);

    /**
     * Desuscribirse del canal
     */
    const desuscribirseAMensajes = useCallback(() => {
        if (!userId || !window.Echo) return;

        window.Echo.leave(`chat.${userId}`);
    }, [userId]);

    /**
     * Cargar contador al montar el componente
     */
    useEffect(() => {
        if (userId) {
            cargarContadorNoLeidos();
        }
    }, [userId, cargarContadorNoLeidos]);

    return {
        mensajes,
        conversaciones,
        mensajesNoLeidos,
        cargando,
        cargarConversaciones,
        cargarMensajes,
        enviarMensaje,
        suscribirseAMensajes,
        desuscribirseAMensajes,
    };
}
