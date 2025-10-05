import { router } from '@inertiajs/react';

interface BotonesFichajeProps {
    puedeEntrar: boolean;
    puedeSalir: boolean;
}

export default function BotonesFichaje({ puedeEntrar, puedeSalir }: BotonesFichajeProps) {
    const handleFicharEntrada = () => {
        router.post('/fichajes/entrada');
    };

    const handleFicharSalida = () => {
        router.post('/fichajes/salida');
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={handleFicharEntrada}
                        disabled={!puedeEntrar}
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                        ✓ Fichar Entrada
                    </button>
                    <button
                        onClick={handleFicharSalida}
                        disabled={!puedeSalir}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                        ✗ Fichar Salida
                    </button>
                </div>
            </div>
        </div>
    );
}
