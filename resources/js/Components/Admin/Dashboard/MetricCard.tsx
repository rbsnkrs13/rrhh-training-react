import type { MetricCardProps } from '@/types';

// Componente reutilizable para mostrar una tarjeta de métrica con título, valor, color, subtítulo y animación opcional que solo se muestra cuando
export default function MetricCard({
    titulo,
    valor,
    color = 'blue',
    descripcion,
    subtitulo,
    cargando = false,
    animacion = false,
}: MetricCardProps) {
    const colores = {
        blue: 'bg-blue-50 border-blue-200 text-blue-700',
        green: 'bg-green-50 border-green-200 text-green-700',
        yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
        red: 'bg-red-50 border-red-200 text-red-700',
        purple: 'bg-purple-50 border-purple-200 text-purple-700',
        gray: 'bg-gray-50 border-gray-200 text-gray-700',
    };

    //render de la tarjeta con claseis dinamicas segun el color que se les pase, y animacion si es true
    return (
        <div
            className={`p-6 rounded-lg border-2 ${colores[color as keyof typeof colores]} transition-all duration-300 hover:scale-105 ${cargando || animacion ? 'animate-pulse' : ''}`}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium opacity-75">{titulo}</p>
                    <p
                        className={`text-2xl font-bold mt-1 transition-colors duration-300 ${valor === '...' ? 'text-gray-400' : ''}`}
                    >
                        {valor}
                    </p>
                    {(descripcion || subtitulo) && (
                        <p className="text-xs opacity-60 mt-1">{descripcion || subtitulo}</p>
                    )}
                </div>
                {(cargando || animacion) && (
                    <div className="ml-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent opacity-50"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
