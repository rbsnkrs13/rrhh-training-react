import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

interface FlashData {
    success?: string;
    error?: string;
    warning?: string;
}

export default function FlashMessage() {
    const { flash } = usePage<{ flash: FlashData }>().props;
    const [visible, setVisible] = useState(false);

    // Detectar si hay algún mensaje flash
    const message = flash?.success || flash?.error || flash?.warning;
    const type = flash?.success ? 'success' : flash?.error ? 'error' : 'warning';

    // Mostrar mensaje cuando llegue uno nuevo
    useEffect(() => {
        if (message) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    //Render para el mensaje, si no hay mensaje o no es visible, no se muestra nada
    if (!message || !visible) return null;

    const styles = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    };

    return (
        <div className={`border px-4 py-3 rounded mb-4 ${styles[type as keyof typeof styles]}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button onClick={() => setVisible(false)} className="ml-4 text-xl font-bold">
                    ×
                </button>
            </div>
        </div>
    );
}
