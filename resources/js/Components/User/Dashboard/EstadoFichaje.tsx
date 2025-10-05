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
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estado Actual</h3>
                {estadoFichaje?.fichado ? (
                    // Empleado fichado (verde)
                    <div className="flex items-center text-green-600">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <div>
                            <p className="font-medium">Fichado desde las {estadoFichaje.ultimaEntrada}</p>
                            <p className="text-sm text-gray-600">
                                Horas hoy: {estadoFichaje.horasHoy.toFixed(1)}h
                            </p>
                        </div>
                    </div>
                ) : (
                    // Empleado no fichado (gris)
                    <div className="flex items-center text-gray-500">
                        <XCircle className="w-5 h-5 mr-2" />
                        <p>No fichado</p>
                    </div>
                )}
            </div>
        </div>
    );
}