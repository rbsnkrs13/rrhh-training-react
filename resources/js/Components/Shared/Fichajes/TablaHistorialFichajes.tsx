import { Calendar, AlertCircle } from 'lucide-react';

interface FichajeIndividual {
    id: number;
    tipo: 'entrada' | 'salida';
    hora: string;
}

interface FichajeDia {
    fecha: string;
    fichajes: FichajeIndividual[];
    horas_trabajadas: number;
    tiene_entrada_abierta: boolean;
}

interface TablaHistorialFichajesProps {
    fichajes: FichajeDia[];
}

const formatearHora = (hora: string) => {
    if (!hora) return '--:--';
    const horaPart = hora.split('T')[1] || hora;
    return horaPart.substring(0, 5);
};

export default function TablaHistorialFichajes({ fichajes }: TablaHistorialFichajesProps) {
    if (fichajes.length === 0) {
        return (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2" />
                        Fichajes Detallados
                    </h3>
                    <div className="text-center py-8 text-gray-500">
                        No hay fichajes registrados para el período seleccionado
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Fichajes Detallados
                </h3>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Día
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fichajes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Horas Trabajadas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fichajes.map((dia, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(dia.fecha).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(dia.fecha).toLocaleDateString('es-ES', { weekday: 'short' })}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="flex flex-wrap gap-2">
                                            {dia.fichajes.map((f) => (
                                                <span
                                                    key={f.id}
                                                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                                        f.tipo === 'entrada'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {f.tipo === 'entrada' ? '→' : '←'} {formatearHora(f.hora)}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {dia.horas_trabajadas.toFixed(1)}h
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            dia.tiene_entrada_abierta
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {dia.tiene_entrada_abierta && <AlertCircle className="w-3 h-3 mr-1" />}
                                            {dia.tiene_entrada_abierta ? 'En curso' : 'Completo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
