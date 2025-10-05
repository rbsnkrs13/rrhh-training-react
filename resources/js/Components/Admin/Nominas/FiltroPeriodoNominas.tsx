import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Calendar } from 'lucide-react';
import { MESES } from '@/Utils/formatters';

interface FiltroPeriodoNominasProps {
    añoActual: number;
    añosDisponibles: number[];
}

export default function FiltroPeriodoNominas({ añoActual, añosDisponibles }: FiltroPeriodoNominasProps) {
    const [filtroAño, setFiltroAño] = useState(añoActual);
    const [filtroMes, setFiltroMes] = useState<number | 'todos'>('todos');

    const aplicarFiltro = () => {
        const params: any = { año: filtroAño };
        if (filtroMes !== 'todos') {
            params.mes = filtroMes;
        }
        router.get('/nominas', params);
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Filtrar Nóminas
                </h3>

                <div className="flex items-end gap-4">
                    <div className="w-40">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Año
                        </label>
                        <select
                            value={filtroAño}
                            onChange={(e) => setFiltroAño(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {añosDisponibles.map(año => (
                                <option key={año} value={año}>{año}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mes
                        </label>
                        <select
                            value={filtroMes}
                            onChange={(e) => setFiltroMes(e.target.value === 'todos' ? 'todos' : Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {MESES.map(mes => (
                                <option key={mes.valor} value={mes.valor}>
                                    {mes.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={aplicarFiltro}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </div>
    );
}
