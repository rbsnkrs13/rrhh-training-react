import { Clock, XCircle } from 'lucide-react';

interface Fichaje {
    id: number | string;
    tipo: 'entrada' | 'salida';
    fecha_hora: string;
}

interface Props {
    fichajesRecientes: Fichaje[];
}

export default function FichajesRecientes({ fichajesRecientes }: Props) {
    const formatFechaHora = (fechaHora: string) => {
        // Formato: "2024-09-17 08:22:00"
        const [fecha, hora] = fechaHora.split(' ');
        const [año, mes, dia] = fecha.split('-');
        const [horas, minutos] = hora.split(':');
        return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fichajes Recientes</h3>
                <div className="space-y-3">
                    {fichajesRecientes.length > 0 ? (
                        // Mostrar máximo 5 fichajes
                        fichajesRecientes.slice(0, 5).map((fichaje) => (
                            <div key={fichaje.id} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    {/* Icono según tipo de fichaje */}
                                    {fichaje.tipo === 'entrada' ? (
                                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                    ) : (
                                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                    )}
                                    <span className="text-sm capitalize">{fichaje.tipo}</span>
                                </div>
                                {/* Fecha y hora del fichaje */}
                                <span className="text-sm text-gray-600">
                                    {formatFechaHora(fichaje.fecha_hora)}
                                </span>
                            </div>
                        ))
                    ) : (
                        // Mensaje cuando no hay fichajes
                        <p className="text-gray-600 text-sm">No hay fichajes recientes</p>
                    )}
                </div>
            </div>
        </div>
    );
}