import { Clock } from 'lucide-react';
import { useReloj } from '@/Hooks/useReloj';

interface BienvenidaRelojProps {
    userName: string;
}

export default function BienvenidaReloj({ userName }: BienvenidaRelojProps) {
    const { formatTime, formatDate } = useReloj();

    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden shadow-lg sm:rounded-xl">
            <div className="p-6 flex items-center h-full">
                <div className="flex items-center justify-between w-full">
                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            ¡Hola, {userName}!
                        </h3>
                        <p className="text-blue-100 mt-2 font-medium">
                            {formatDate}
                        </p>
                    </div>
                    <div className="flex items-center text-3xl font-bold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <Clock className="w-7 h-7 mr-2" />
                        {formatTime}
                    </div>
                </div>
            </div>
        </div>
    );
}