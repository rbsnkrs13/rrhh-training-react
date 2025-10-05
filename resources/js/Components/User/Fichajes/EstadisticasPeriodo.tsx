interface Estadisticas {
    totalDias: number;
    diasCompletos: number;
    diasIncompletos: number;
    totalHoras: number;
    promedioHoras: number;
}

interface EstadisticasPeriodoProps {
    estadisticas: Estadisticas;
    titulo: string;
}

export default function EstadisticasPeriodo({ estadisticas, titulo }: EstadisticasPeriodoProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {titulo}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                            {estadisticas.totalDias}
                        </div>
                        <div className="text-sm text-gray-600">Total Fichajes</div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                            {estadisticas.diasCompletos}
                        </div>
                        <div className="text-sm text-gray-600">Días Completos</div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                            {estadisticas.diasIncompletos}
                        </div>
                        <div className="text-sm text-gray-600">Días Incompletos</div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {estadisticas.totalHoras.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-600">Total Horas</div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600">
                            {estadisticas.promedioHoras.toFixed(1)}h
                        </div>
                        <div className="text-sm text-gray-600">Promedio/Día</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
