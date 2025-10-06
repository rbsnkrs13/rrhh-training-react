import { useState, useEffect, useMemo } from 'react';

export function useReloj() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Actualizar cada 30 segundos para reducir re-renders
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 30000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = useMemo(() => {
        return currentTime.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, [currentTime]);

    const formatDate = useMemo(() => {
        return currentTime.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }, [currentTime]);

    return { currentTime, formatTime, formatDate };
}
