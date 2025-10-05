import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface Fichaje {
    id: number;
    empleado: {
        name: string;
    };
    tipo: 'entrada' | 'salida';
    hora: string;
    fecha: string;
}

interface Props {
    fichajes: Fichaje[];
}

export default function UltimosFichajes({ fichajes }: Props) {
    const formatHora = (hora: string) => {
        return new Date(`2000-01-01T${hora}`).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos Fichajes</h3>

            <div className="space-y-3">
                {fichajes.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                        No hay fichajes recientes
                    </p>
                ) : (
                    fichajes.map((fichaje) => (
                        <div
                            key={fichaje.id}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                {fichaje.tipo === 'entrada' ? (
                                    <ArrowDownCircle className="w-5 h-5 text-green-500" />
                                ) : (
                                    <ArrowUpCircle className="w-5 h-5 text-red-500" />
                                )}
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {fichaje.empleado.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {fichaje.tipo === 'entrada' ? 'Entrada' : 'Salida'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                    {formatHora(fichaje.hora)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
