import { useState, useEffect } from 'react';

export function useReloj() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return { currentTime, formatTime, formatDate };
}
