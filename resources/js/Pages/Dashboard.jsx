import MetricCard from "@/Components/MetricCard";
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import useMetricas from '@/Hooks/useMetricas';
import useDepartamentos from '@/Hooks/useDepartamentos';
import usePeriodos from '@/Hooks/usePeriodos';
import HeaderConFiltros from '@/Components/Dashboard/HeaderConFiltros';
import MetricasPrincipales from '@/Components/Dashboard/MetricasPrincipales';
import MetricasSecundarias from '@/Components/Dashboard/MetricasSecundarias';
import SeccionDepartamentos from '@/Components/Dashboard/SeccionDepartamentos';

export default function Dashboard({ empleadosIniciales, configuracion }) { //Datos importados de web.php
    // Estado para el período seleccionado que despues se usaran en los botones
    const [empleados] = useState(empleadosIniciales); //Viene de web.php 
    // Estados para efectos visuales
    const [animacionActiva, setAnimacionActiva] = useState(false);

    const {
        añoSeleccionado,
        mesSeleccionado,
        setAñoSeleccionado,
        setMesSeleccionado,
        meses,
        añosCompletos
    } = usePeriodos(empleados);

    const { metricas, cargandoMetricas, simularCarga } = useMetricas(
        empleados,
        añoSeleccionado,
        mesSeleccionado
    );

    const { departamentos, deptoMayorEmpleados } = useDepartamentos(empleados);


    // useEffect optimizado - solo maneja animaciones
    useEffect(() => {
        setAnimacionActiva(true);
        const cleanup = simularCarga();

        const timer = setTimeout(() => {
            setAnimacionActiva(false);
        }, 300);

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
                ratioRetención: `${metricas.ratioRetencion.toFixed(1)}%`
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

                    {/* Métricas secundarias */}
                    <MetricasSecundarias
                        metricas={metricas}
                    />

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

