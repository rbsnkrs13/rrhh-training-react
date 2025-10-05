import { BarChart3 } from 'lucide-react';
import { formatearSalario } from '@/Utils/formatters';

interface Estadisticas {
    total_nominas: number;
    nominas_descargadas: number;
    pendientes_descarga: number;
    salario_bruto_total: number;
    salario_neto_total: number;
}

interface EstadisticasNominasProps {
    estadisticas: Estadisticas;
}

export default function EstadisticasNominas({ estadisticas }: EstadisticasNominasProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Resumen del Año
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {estadisticas.total_nominas}
                        </div>
                        <div className="text-sm text-gray-600">Total Nóminas</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {estadisticas.nominas_descargadas}
                        </div>
                        <div className="text-sm text-gray-600">Descargadas</div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                            {estadisticas.pendientes_descarga}
                        </div>
                        <div className="text-sm text-gray-600">Pendientes</div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-purple-600">
                            {formatearSalario(estadisticas.salario_bruto_total)}
                        </div>
                        <div className="text-sm text-gray-600">Salario Bruto Total</div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-indigo-600">
                            {formatearSalario(estadisticas.salario_neto_total)}
                        </div>
                        <div className="text-sm text-gray-600">Salario Neto Total</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
