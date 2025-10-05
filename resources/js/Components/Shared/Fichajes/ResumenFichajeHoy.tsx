import { Clock } from 'lucide-react';

interface FichajeIndividual {
    id: number;
    tipo: 'entrada' | 'salida';
    hora: string;
}

interface ResumenFichajeHoyProps {
    fichajesHoy: FichajeIndividual[];
    tieneEntradaAbierta: boolean;
    horasHoy: number;
}

const formatearHora = (hora: string) => {
    if (!hora) return '--:--';
    const horaPart = hora.split('T')[1] || hora;
    return horaPart.substring(0, 5);
};

export default function ResumenFichajeHoy({ fichajesHoy, tieneEntradaAbierta, horasHoy }: ResumenFichajeHoyProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Fichaje de Hoy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <div className="text-sm text-gray-500">Estado Actual</div>
                        <div className="text-lg font-semibold mt-1">
                            {tieneEntradaAbierta ? (
                                <span className="text-yellow-600">Fichado</span>
                            ) : fichajesHoy.length > 0 ? (
                                <span className="text-green-600">Completo</span>
                            ) : (
                                <span className="text-gray-600">Sin fichar</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <div className="text-sm text-gray-500">Fichajes de Hoy</div>
                        <div className="text-lg font-semibold mt-1">
                            {fichajesHoy.length > 0 ? (
                                <div>
                                    <div>{fichajesHoy.length} fichajes</div>
                                    <div className="text-sm text-gray-600 font-normal">
                                        Último: {formatearHora(fichajesHoy[fichajesHoy.length - 1].hora)}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-gray-400">Sin fichajes</span>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-center">
                        <div className="text-sm text-gray-500">Horas Trabajadas Hoy</div>
                        <div className="text-lg font-semibold mt-1">
                            {horasHoy.toFixed(1)}h
                        </div>
                    </div>
                </div>

                {fichajesHoy.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <div className="text-sm font-medium text-gray-700">Detalle de fichajes:</div>
                        <div className="flex flex-wrap gap-2">
                            {fichajesHoy.map((fichaje) => (
                                <span
                                    key={fichaje.id}
                                    className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
                                        fichaje.tipo === 'entrada'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}
                                >
                                    {fichaje.tipo === 'entrada' ? '→' : '←'} {formatearHora(fichaje.hora)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
