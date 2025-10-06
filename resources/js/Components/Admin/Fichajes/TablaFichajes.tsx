import { formatearHoras } from '@/Utils/formatHoras';
import { Download } from 'lucide-react';

interface FichajeIndividual {
    id: number;
    tipo: 'entrada' | 'salida';
    hora: string;
}

interface FichajeDia {
    empleado_id: number;
    empleado_nombre: string;
    fecha: string;
    fichajes: FichajeIndividual[];
    horas_trabajadas: number;
    estado: 'completo' | 'en_curso' | 'sin_fichar' | 'incompleto';
}

interface TablaFichajesProps {
    fichajes: FichajeDia[];
}

export default function TablaFichajes({ fichajes }: TablaFichajesProps) {
    const formatearHora = (hora: string) => {
        if (!hora) return '--:--';
        const horaPart = hora.split('T')[1] || hora;
        return horaPart.substring(0, 5);
    };

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'completo':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Completo</span>;
            case 'en_curso':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">⚠️ En Curso</span>;
            case 'incompleto':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">⚠️ Incompleto</span>;
            case 'sin_fichar':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">❌ Sin Fichar</span>;
            default:
                return null;
        }
    };

    const handleExportarCSV = () => {
        console.log('Exportar CSV');
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        📋 Fichajes de Empleados
                    </h3>
                    <button
                        onClick={handleExportarCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                        <Download className="h-4 w-4" />
                        Exportar CSV
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Empleado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fichajes
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Horas
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Estado
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acción
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fichajes.length > 0 ? fichajes.map((fichaje, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium text-sm">
                                                        {fichaje.empleado_nombre.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {fichaje.empleado_nombre}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(fichaje.fecha).toLocaleDateString('es-ES')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {fichaje.fichajes.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {fichaje.fichajes.map((f) => (
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
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatearHoras(fichaje.horas_trabajadas)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getEstadoBadge(fichaje.estado)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <a
                                            href={`/admin/empleados/${fichaje.empleado_id}`}
                                            className="text-blue-600 hover:text-blue-900 font-medium"
                                        >
                                            Ver Detalle
                                        </a>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No hay fichajes para mostrar con los filtros seleccionados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación Placeholder */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        ← Anterior
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium">
                        1
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Siguiente →
                    </button>
                </div>
            </div>
        </div>
    );
}
