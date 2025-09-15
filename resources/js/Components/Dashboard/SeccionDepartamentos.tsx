import { Link } from '@inertiajs/react';
import { useMemo, useCallback } from 'react';
import type { Empleado } from '@/types';

interface SeccionDepartamentosProps {
    departamentos: Record<string, number>;
    deptoMayorEmpleados: [string, number];
    empleados: Empleado[];
    totalEmpleados: number;
}

// Componente para la sección de departamentos y empleados recientes en el dashboard
export default function SeccionDepartamentos({
    departamentos,
    deptoMayorEmpleados,
    empleados,
    totalEmpleados
}: SeccionDepartamentosProps) {
    // useMemo para empleados activos - evita filtrar en cada render
    const empleadosActivosRecientes = useMemo(() => {
        return empleados
            .filter(emp => emp.activo)
            .slice(0, 4);
    }, [empleados]);

    // useCallback para función de cálculo de porcentaje - evita recrear función
    const calcularPorcentaje = useCallback((count: number) => {
        return (count / totalEmpleados) * 100;
    }, [totalEmpleados]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribución por departamentos */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    📊 Distribución por Departamentos
                </h2>
                <div className="space-y-3">
                    {Object.entries(departamentos).map(([depto, count]) => (
                        <BarraDepartamento
                            key={depto}
                            departamento={depto}
                            count={count}
                            porcentaje={calcularPorcentaje(count)}
                        />
                    ))}
                </div>

                {deptoMayorEmpleados && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            🏆 <strong>{deptoMayorEmpleados[0]}</strong> es el departamento con más empleados ({deptoMayorEmpleados[1]})
                        </p>
                    </div>
                )}
            </div>

            {/* Empleados recientes */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    👋 Empleados Activos Recientes
                </h2>
                <div className="space-y-3">
                    {empleadosActivosRecientes.map(empleado => (
                        <EmpleadoItem key={empleado.id} empleado={empleado} />
                    ))}
                </div>

                <Link
                    href="/empleados"
                    className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
                >
                    Ver todos los empleados →
                </Link>
            </div>
        </div>
    );
}

// Componentes internos para mejor legibilidad
interface BarraDepartamentoProps {
    departamento: string;
    count: number;
    porcentaje: number;
}

function BarraDepartamento({ departamento, count, porcentaje }: BarraDepartamentoProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-700">{departamento}</span>
            <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${porcentaje}%` }}
                    />
                </div>
                <span className="font-semibold text-gray-900 w-8 text-right">
                    {count}
                </span>
            </div>
        </div>
    );
}

interface EmpleadoItemProps {
    empleado: Empleado;
}

function EmpleadoItem({ empleado }: EmpleadoItemProps) {
    return (
        <div className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <div className="flex-1">
                <p className="font-medium text-gray-900">{empleado.nombre}</p>
                <p className="text-sm text-gray-500">{empleado.departamento}</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Activo
            </span>
        </div>
    );
}