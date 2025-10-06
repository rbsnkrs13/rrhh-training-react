/**
 * Convierte horas en formato decimal a formato HH:MMh
 * Ejemplo: 8.25 → "8:15h", 7.5 → "7:30h"
 */
export function formatearHoras(horasDecimal: number): string {
    const horas = Math.floor(horasDecimal);
    const minutos = Math.round((horasDecimal - horas) * 60);

    return `${horas}:${minutos.toString().padStart(2, '0')}h`;
}

/**
 * Convierte formato HH:MM a decimal
 * Ejemplo: "8:15" → 8.25, "7:30" → 7.5
 */
export function horasADecimal(horasFormato: string): number {
    const [horas, minutos] = horasFormato.split(':').map(Number);
    return horas + (minutos / 60);
}
