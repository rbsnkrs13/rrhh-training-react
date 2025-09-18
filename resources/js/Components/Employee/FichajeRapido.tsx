import { CheckCircle, XCircle } from 'lucide-react';

interface Props {
    estadoFichaje?: {
        fichado: boolean;
        ultimaEntrada?: string;
        horasHoy: number;
    };
    onFichaje: (tipo: 'entrada' | 'salida') => void;
}

export default function FichajeRapido({ estadoFichaje, onFichaje }: Props) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Fichaje Rápido</h3>
                {/* Grid de 2 columnas para los botones */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Botón de Entrada - Verde */}
                    <button
                        onClick={() => onFichaje('entrada')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                        disabled={estadoFichaje?.fichado}
                    >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Entrada
                    </button>
                    {/* Botón de Salida - Rojo */}
                    <button
                        onClick={() => onFichaje('salida')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
                        disabled={!estadoFichaje?.fichado}
                    >
                        <XCircle className="w-5 h-5 mr-2" />
                        Salida
                    </button>
                </div>
            </div>
        </div>
    );
}