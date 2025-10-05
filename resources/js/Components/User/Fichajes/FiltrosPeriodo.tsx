import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Filter, Download } from 'lucide-react';

interface FiltrosPeriodoProps {
    añoInicial: number;
    mesInicial: number;
    añosDisponibles: number[];
    onExportarCSV: () => void;
    tieneData: boolean;
    rutaFiltros: string;
}

const MESES = [
    { value: 1, label: 'Enero' },
    { value: 2, label: 'Febrero' },
    { value: 3, label: 'Marzo' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Mayo' },
    { value: 6, label: 'Junio' },
    { value: 7, label: 'Julio' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Septiembre' },
    { value: 10, label: 'Octubre' },
    { value: 11, label: 'Noviembre' },
    { value: 12, label: 'Diciembre' }
];

export default function FiltrosPeriodo({
    añoInicial,
    mesInicial,
    añosDisponibles,
    onExportarCSV,
    tieneData,
    rutaFiltros
}: FiltrosPeriodoProps) {
    const [filtroAño, setFiltroAño] = useState(añoInicial);
    const [filtroMes, setFiltroMes] = useState(mesInicial);

    const aplicarFiltros = () => {
        router.get(rutaFiltros, {
            año: filtroAño,
            mes: filtroMes
        });
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Filter className="w-5 h-5 mr-2" />
                        Filtros
                    </h3>
                    <button
                        onClick={onExportarCSV}
                        disabled={!tieneData}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </button>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mes
                        </label>
                        <select
                            value={filtroMes}
                            onChange={(e) => setFiltroMes(Number(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {MESES.map(mes => (
                                <option key={mes.value} value={mes.value}>{mes.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-end">
                        <button
                            onClick={aplicarFiltros}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Aplicar Filtros
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
