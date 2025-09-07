import MetricCard from "@/Components/MetricCard";
import { useMemo } from 'react'; 

// Importa MetricCard para mostrar cada métrica
// Recibe metricas, estados de carga y selección de período desde el componente padre (Dashboard)
export default function MetricasSecundarias({ metricas }) {
    const estadoRetencion = useMemo(() => {
        if (metricas.ratioRetencion >= 85) return { texto: "Excelente", color: "green" };
        if (metricas.ratioRetencion >= 70) return { texto: "Bueno", color: "yellow" };
        return { texto: "Crítico", color: "red" };
    }, [metricas.ratioRetencion]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Tarjetas que se insertan en dashboard que se componen de 5 variables para que se puedan pintar y mostrar los datos vayamos a mostrar */}
            <MetricCard
                titulo="Empleados Inactivos"
                valor={metricas.empleadosInactivosTotal}
                color="red"
                subtitulo="Requieren atención"
            />
            <MetricCard
                titulo="Antigüedad Media"
                valor={`${metricas.promedioAntiguedad.toFixed(1)} años`}
                color="purple"
                subtitulo="Experiencia promedio"
            />
            <MetricCard
                titulo="Distribución Salarial"
                valor={`€${Math.round(metricas.rangoSalarial.min).toLocaleString()}-${Math.round(metricas.rangoSalarial.max).toLocaleString()}`}
                color="green"
                subtitulo="Rango salarial"
            />
            <MetricCard
                titulo="Ratio Retención"
                valor={`${metricas.ratioRetencion.toFixed(1)}%`}
                color={estadoRetencion.color}
                subtitulo={estadoRetencion.texto}
            />
        </div>
    );
}