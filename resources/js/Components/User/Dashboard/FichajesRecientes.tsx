import { CheckCircle, Clock } from 'lucide-react';

interface Fichaje {
    fecha: string;
    horas: number;
    completo: boolean;
}

interface FichajesRecientesProps {
    fichajes: Fichaje[];
}

export default function FichajesRecientes({ fichajes }: FichajesRecientesProps) {
    const formatearFecha = (fechaStr: string) => {
        const fecha = fechaStr.split('T')[0];
        const [año, mes, dia] = fecha.split('-');
        return `${dia}/${mes}/${año}`;
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fichajes Recientes</h3>
                <div className="space-y-3">
                    {fichajes && fichajes.length > 0 ? (
                        fichajes.slice(0, 5).map((fichaje, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    {fichaje.completo ? (
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <Clock className="w-5 h-5 text-blue-500" />
                                    )}
                                    <span className="text-sm font-medium">{formatearFecha(fichaje.fecha)}</span>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                    {fichaje.horas.toFixed(1)}h
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600 text-sm">No hay fichajes recientes</p>
                    )}
                </div>
            </div>
        </div>
    );
}