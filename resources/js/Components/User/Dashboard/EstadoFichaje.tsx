import { formatearHoras } from '@/Utils/formatHoras';
import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
    estadoFichaje?: {
        fichado: boolean;
        ultimaEntrada?: string;
        horasHoy: number;
    };
}

export default function EstadoFichaje({ estadoFichaje }: Props) {
    return (
        <div className={`overflow-hidden shadow-lg sm:rounded-xl ${
            estadoFichaje?.fichado
                ? 'bg-gradient-to-br from-emerald-500 to-green-600'
                : 'bg-gradient-to-br from-slate-500 to-gray-600'
        }`}>
            <div className="p-6">
                <h3 className="text-lg font-semibold text-white/90 mb-4">Estado Actual</h3>
                {estadoFichaje?.fichado ? (
                    <div className="flex items-start text-white">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="ml-3">
                            <p className="font-semibold text-lg">Fichado desde las {estadoFichaje.ultimaEntrada}</p>
                            <p className="text-sm text-white/80 mt-1">
                                Horas trabajadas hoy: {formatearHoras(estadoFichaje.horasHoy)}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center text-white">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <p className="ml-3 font-semibold text-lg">No fichado</p>
                    </div>
                )}
            </div>
        </div>
    );
}