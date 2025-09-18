import { Clock } from 'lucide-react';

interface Props {
    userName: string;
    currentTime: Date;
}

export default function BienvenidaReloj({ userName, currentTime }: Props) {
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

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    {/* Saludo personalizado */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            ¡Hola, {userName}!
                        </h3>
                        <p className="text-gray-600 mt-1">
                            {formatDate(currentTime)}
                        </p>
                    </div>
                    {/* Reloj en tiempo real */}
                    <div className="flex items-center text-2xl font-bold text-blue-600">
                        <Clock className="w-6 h-6 mr-2" />
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}