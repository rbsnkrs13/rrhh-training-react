import { Clock, Users, AlertTriangle } from 'lucide-react';

interface FichajeEstado {
    empleados_fichados: number;
    sin_fichar: number;
    entradas_abiertas: number;
    horas_hoy: number;
}

interface Props {
    estado: FichajeEstado;
}

export default function FichajesEstado({ estado }: Props) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Estado de Fichajes</h3>
                <Clock className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Empleados fichados */}
                <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-green-600">
                                {estado.empleados_fichados}
                            </p>
                            <p className="text-sm text-green-700">Fichados ahora</p>
                        </div>
                    </div>
                </div>

                {/* Sin fichar */}
                <div className="bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600">
                                {estado.sin_fichar}
                            </p>
                            <p className="text-sm text-yellow-700">Sin fichar hoy</p>
                        </div>
                    </div>
                </div>

                {/* Entradas abiertas */}
                <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Clock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-600">
                                {estado.entradas_abiertas}
                            </p>
                            <p className="text-sm text-red-700">Entrada abierta</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horas totales hoy */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total horas trabajadas hoy:</span>
                    <span className="text-lg font-bold text-indigo-600">
                        {estado.horas_hoy.toFixed(1)}h
                    </span>
                </div>
            </div>
        </div>
    );
}
