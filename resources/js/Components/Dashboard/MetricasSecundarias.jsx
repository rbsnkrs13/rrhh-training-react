import MetricCard from "@/Components/MetricCard";
import { useMemo } from 'react';

export default function MetricasSecundarias({ metricas }) {
    // useMemo para cálculos derivados - evita recalcular en cada render
    const rangoSalarial = useMemo(() => {
        const salarios = empleados.map(e => parseFloat(e.salario)).filter(s => !isNaN(s));
        const min = Math.min(...salarios);
        const max = Math.max(...salarios);
        return `${Math.round(min).toLocaleString()}-${Math.round(max).toLocaleString()}`;
    }, [empleados]);

    const estadoRetencion = useMemo(() => {
        if (metricas.ratioRetencion >= 85) return { texto: "Excelente", color: "green" };
        if (metricas.ratioRetencion >= 70) return { texto: "Bueno", color: "yellow" };
        return { texto: "Crítico", color: "red" };
    }, [metricas.ratioRetencion]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                valor={`€${rangoSalarial}`}
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