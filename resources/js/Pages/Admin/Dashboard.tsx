import { useState, useEffect } from 'react';
import useMetricas from '@/Hooks/useMetricas';
import useDepartamentos from '@/Hooks/useDepartamentos';
import usePeriodos from '@/Hooks/usePeriodos';
import HeaderConFiltros from '@/Components/Dashboard/HeaderConFiltros';
import MetricasPrincipales from '@/Components/Dashboard/MetricasPrincipales';
import MetricasSecundarias from '@/Components/Dashboard/MetricasSecundarias';
import SeccionDepartamentos from '@/Components/Dashboard/SeccionDepartamentos';
import { Clock, FileText, Users, BarChart3 } from 'lucide-react';
import type { DashboardProps } from '@/types';

export default function Dashboard({ empleadosIniciales, configuracion }: DashboardProps) {
    //Datos importados de web.php
    const [empleados] = useState(empleadosIniciales); // lista de empleados, no cambia, solo para cálculos
    const [animacionActiva, setAnimacionActiva] = useState(false); // Estados para efectos visuales en este caso cuando cambian las métricas

    // hooks de usePeriodos, useMetricas y useDepartamentos, traerte el return de cada una para usarlas
    const {
        añoSeleccionado,
        mesSeleccionado,
        setAñoSeleccionado,
        setMesSeleccionado,
        meses,
        añosCompletos,
    } = usePeriodos(empleados);

    const { metricas, cargandoMetricas, simularCarga } = useMetricas(
        empleados,
        añoSeleccionado,
        mesSeleccionado
    );

    const { departamentos, deptoMayorEmpleados } = useDepartamentos(empleados);

    // useEffect optimizado - solo maneja animaciones
    useEffect(() => {
        //Activa animacion y simula carga(useMetricas)
        setAnimacionActiva(true);
        const cleanup = simularCarga();

        //Temporizador para desactivar animacion despues de 300ms
        const timer = setTimeout(() => {
            setAnimacionActiva(false);
        }, 300);

        //Refresca temporizador y limpieza de carga si cambian año o mes para optimizacion
        return () => {
            clearTimeout(timer);
            if (cleanup) cleanup();
        };
    }, [añoSeleccionado, mesSeleccionado, simularCarga]);

    // useEffect para logging - separado por responsabilidad
    useEffect(() => {
        if (!cargandoMetricas) {
            console.log('📊 Métricas actualizadas:', {
                período: `${meses.find(m => m.valor === mesSeleccionado)?.nombre} ${añoSeleccionado}`,
                empleadosContratados: metricas.empleadosContratadosMes,
                totalEmpleados: metricas.totalEmpleados,
                ratioRetención: `${metricas.ratioRetencion.toFixed(1)}%`,
            });

            // Alertas inteligentes
            if (metricas.empleadosContratadosMes === 0) {
                console.log('⚠️ Alerta: No hay contrataciones en este período');
            }
            if (metricas.ratioRetencion < 70) {
                console.log('🚨 Alerta: Ratio de retención crítico');
            }
        }
    }, [metricas, cargandoMetricas, añoSeleccionado, mesSeleccionado, meses]);

    //Render del dashboard
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header con filtros */}
                    <HeaderConFiltros
                        configuracion={configuracion}
                        añoSeleccionado={añoSeleccionado}
                        setAñoSeleccionado={setAñoSeleccionado}
                        mesSeleccionado={mesSeleccionado}
                        setMesSeleccionado={setMesSeleccionado}
                        añosCompletos={añosCompletos}
                        meses={meses}
                    />

                    {/* Métricas principales */}
                    <MetricasPrincipales
                        metricas={metricas}
                        cargandoMetricas={cargandoMetricas}
                        animacionActiva={animacionActiva}
                        mesSeleccionado={mesSeleccionado}
                        añoSeleccionado={añoSeleccionado}
                        meses={meses}
                    />

                    {/* Accesos Rápidos */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accesos Rápidos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Tarjeta Fichajes */}
                            <a
                                href="/admin/fichajes"
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300 group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Clock className="h-8 w-8 text-blue-600 group-hover:text-blue-700" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-700">
                                            Sistema de Fichajes
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Ver fichajes de empleados
                                        </p>
                                    </div>
                                </div>
                            </a>

                            {/* Tarjeta Nóminas */}
                            <a
                                href="/admin/nominas"
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-green-300 group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <FileText className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-700">
                                            Gestión de Nóminas
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Subir y gestionar nóminas
                                        </p>
                                    </div>
                                </div>
                            </a>

                            {/* Tarjeta Gestión Empleados */}
                            <a
                                href="/admin/empleados"
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200 hover:border-purple-300 group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Users className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                                            Gestión Empleados
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Ver y gestionar empleados
                                        </p>
                                    </div>
                                </div>
                            </a>

                            {/* Tarjeta Reportes */}
                            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 opacity-60">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BarChart3 className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-sm font-medium text-gray-500">
                                            Reportes Avanzados
                                        </h4>
                                        <p className="text-sm text-gray-400">
                                            Próximamente...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Métricas secundarias */}
                    <MetricasSecundarias metricas={metricas} />

                    {/* Sección departamentos */}
                    <SeccionDepartamentos
                        departamentos={departamentos}
                        deptoMayorEmpleados={deptoMayorEmpleados}
                        empleados={empleados}
                        totalEmpleados={metricas.totalEmpleados}
                    />
                </div>
            </div>
        </div>
    );
}
