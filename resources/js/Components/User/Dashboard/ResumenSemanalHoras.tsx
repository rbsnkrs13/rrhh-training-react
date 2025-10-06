import { formatearHoras } from '@/Utils/formatHoras';

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
        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg sm:rounded-xl border border-indigo-100">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Horas esta Semana</h3>
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatearHoras(horasSemana.trabajadas)}
                        </span>
                        <span className="text-gray-500 font-medium">
                            / {formatearHoras(horasSemana.objetivo)}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${porcentaje}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-600 mt-3 font-medium">
                        {faltanHoras > 0
                            ? `Faltan ${formatearHoras(faltanHoras)} para completar`
                            : '¡Objetivo completado! 🎉'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}