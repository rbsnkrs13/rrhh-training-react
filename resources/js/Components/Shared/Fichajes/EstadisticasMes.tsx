import { BarChart3 } from 'lucide-react';

interface Estadisticas {
    total_dias_trabajados: number;
    total_horas_mes: number;
    promedio_horas_dia: number;
}

interface EstadisticasMesProps {
    estadisticas: Estadisticas;
}

export default function EstadisticasMes({ estadisticas }: EstadisticasMesProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Estadísticas del Mes
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {estadisticas.total_dias_trabajados}
                        </div>
                        <div className="text-sm text-gray-600">Días Trabajados</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {estadisticas.total_horas_mes.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-600">Total Horas</div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {estadisticas.promedio_horas_dia.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-600">Promedio/Día</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
