interface Props {
    horasSemana: {
        trabajadas: number;
        objetivo: number;
    };
}

export default function ResumenSemanalHoras({ horasSemana }: Props) {
    const porcentaje = Math.min((horasSemana.trabajadas / horasSemana.objetivo) * 100, 100);
    const faltanHoras = horasSemana.objetivo - horasSemana.trabajadas;

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Horas esta Semana</h3>
                <div>
                    {/* Contador de horas */}
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-2xl font-bold text-blue-600">
                            {horasSemana.trabajadas}h
                        </span>
                        <span className="text-gray-600">
                            / {horasSemana.objetivo}h
                        </span>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${porcentaje}%` }}
                        ></div>
                    </div>

                    {/* Mensaje informativo */}
                    <p className="text-sm text-gray-600 mt-2">
                        {faltanHoras > 0
                            ? `Faltan ${faltanHoras.toFixed(1)}h`
                            : 'Objetivo completado!'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}