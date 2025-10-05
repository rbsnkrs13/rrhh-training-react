import { useMemo } from 'react';

interface FichajeDia {
    fecha: string;
    horas_trabajadas: number;
    tiene_entrada_abierta: boolean;
}

export function useEstadisticasFichajes(fichajes: FichajeDia[]) {
    return useMemo(() => {
        const completos = fichajes.filter(f => !f.tiene_entrada_abierta);
        const totalHoras = fichajes.reduce((sum, f) => sum + f.horas_trabajadas, 0);

        return {
            totalDias: fichajes.length,
            diasCompletos: completos.length,
            diasIncompletos: fichajes.filter(f => f.tiene_entrada_abierta).length,
            totalHoras: totalHoras,
            promedioHoras: completos.length > 0 ? totalHoras / completos.length : 0
        };
    }, [fichajes]);
}
