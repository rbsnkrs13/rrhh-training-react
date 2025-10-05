import { X } from 'lucide-react';

interface HeaderChatProps {
    titulo: string;
    subtitulo?: string;
    onCerrar?: () => void;
}

export default function HeaderChat({ titulo, subtitulo, onCerrar }: HeaderChatProps) {
    return (
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800 px-6 py-4 text-white">
            <div>
                <h3 className="text-lg font-semibold">{titulo}</h3>
                {subtitulo && <p className="text-sm text-gray-300">{subtitulo}</p>}
            </div>
            {onCerrar && (
                <button
                    onClick={onCerrar}
                    className="rounded-full p-1 transition-colors hover:bg-gray-700"
                    aria-label="Cerrar chat"
                >
                    <X className="h-6 w-6" />
                </button>
            )}
        </div>
    );
}
