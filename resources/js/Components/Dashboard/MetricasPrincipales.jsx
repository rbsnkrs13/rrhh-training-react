import MetricCard from "@/Components/MetricCard";

export default function MetricasPrincipales({ 
    metricas, 
    cargandoMetricas, 
    animacionActiva, 
    mesSeleccionado, 
    añoSeleccionado, 
    meses 
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                titulo="Total Empleados"
                valor={cargandoMetricas ? "..." : metricas.totalEmpleados}
                color="blue"
                subtitulo="En toda la empresa"
                animacion={animacionActiva}
            />
            <MetricCard
                titulo="Empleados Activos"
                valor={cargandoMetricas ? "..." : metricas.empleadosActivosTotal}
                color="green"
                subtitulo={cargandoMetricas ? "Calculando..." : `${metricas.ratioRetencion.toFixed(1)}% retención`}
                animacion={animacionActiva}
            />
            <MetricCard
                titulo={`Contratados en ${meses.find(m => m.valor === mesSeleccionado)?.nombre}`}
                valor={cargandoMetricas ? "..." : metricas.empleadosContratadosMes}
                color={metricas.empleadosContratadosMes > 0 ? "blue" : "gray"}
                subtitulo={`${añoSeleccionado}`}
                animacion={animacionActiva}
            />
            <MetricCard
                titulo="Promedio Salarial"
                valor={cargandoMetricas ? "..." : `€${Math.round(metricas.promedioSalarial).toLocaleString()}`}
                color="yellow"
                subtitulo="Salario medio"
                animacion={animacionActiva}
            />
        </div>
    );
}