import MetricCard from '@/Components/Admin/Dashboard/MetricCard';
import type { Metricas, Mes } from '@/types';

interface MetricasPrincipalesProps {
    metricas: Metricas;
    cargandoMetricas: boolean;
    animacionActiva: boolean;
    mesSeleccionado: number;
    añoSeleccionado: number;
    meses: Mes[];
}

// Importa MetricCard para mostrar cada métrica
// Recibe metricas, estados de carga y selección de período desde el componente padre (Dashboard)
export default function MetricasPrincipales({
    metricas,
    cargandoMetricas,
    animacionActiva,
    mesSeleccionado,
    añoSeleccionado,
    meses,
}: MetricasPrincipalesProps) {
    // Render de las tarjetas de métricas principales
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Tarjetas que se insertan en dashboard que se componen de 5 variables para que se puedan pintar y mostrar los datos vayamos a mostrar */}
            <MetricCard
                titulo="Total Empleados"
                valor={cargandoMetricas ? '...' : metricas.totalEmpleados}
                color="blue"
                subtitulo="En toda la empresa"
                animacion={animacionActiva}
            />
            <MetricCard
                titulo="Empleados Activos"
                valor={cargandoMetricas ? '...' : metricas.empleadosActivosTotal}
                color="green"
                subtitulo={
                    cargandoMetricas
                        ? 'Calculando...'
                        : `${metricas.ratioRetencion.toFixed(1)}% retención`
                }
                animacion={animacionActiva}
            />
            <MetricCard
                titulo={`Contratados en ${meses.find(m => m.valor === mesSeleccionado)?.nombre}`}
                valor={cargandoMetricas ? '...' : metricas.empleadosContratadosMes}
                color={metricas.empleadosContratadosMes > 0 ? 'blue' : 'gray'}
                subtitulo={`${añoSeleccionado}`}
                animacion={animacionActiva}
            />
            <MetricCard
                titulo="Promedio Salarial"
                valor={
                    cargandoMetricas
                        ? '...'
                        : `€${Math.round(metricas.promedioSalarial).toLocaleString()}`
                }
                color="yellow"
                subtitulo="Salario medio"
                animacion={animacionActiva}
            />
        </div>
    );
}
