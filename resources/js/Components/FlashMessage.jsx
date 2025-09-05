import { useState, useEffect } from 'react';

export default function FlashMessage({ message, type = 'success' }) {
    const [visible, setVisible] = useState(true); // Estado para controlar la visibilidad del mensaje

    //Cada vez que llega un mensaje, se muestra y se oculta despues de 5 segundos
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000); // Desaparece en 5 segundos

            return () => clearTimeout(timer);
        }
    }, [message]);

    //Render para el mensaje, si no hay mensaje o no es visible, no se muestra nada
    if (!message || !visible) return null;

    const styles = {
        success: 'bg-green-100 border-green-400 text-green-700',
        error: 'bg-red-100 border-red-400 text-red-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
    };

    return (
        <div className={`border px-4 py-3 rounded mb-4 ${styles[type]}`}>
            <div className="flex justify-between items-center">
                <span>{message}</span>
                <button 
                    onClick={() => setVisible(false)}
                    className="ml-4 text-xl font-bold"
                >
                    ×
                </button>
            </div>
        </div>
    );
}