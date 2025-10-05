import { Clock } from 'lucide-react';
import { useReloj } from '@/Hooks/useReloj';

interface BienvenidaRelojProps {
    userName: string;
}

export default function BienvenidaReloj({ userName }: BienvenidaRelojProps) {
    const { currentTime, formatTime, formatDate } = useReloj();

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 flex items-center h-full">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            ¡Hola, {userName}!
                        </h3>
                        <p className="text-gray-600 mt-1">
                            {formatDate(currentTime)}
                        </p>
                    </div>
                    <div className="flex items-center text-2xl font-bold text-blue-600">
                        <Clock className="w-6 h-6 mr-2" />
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}