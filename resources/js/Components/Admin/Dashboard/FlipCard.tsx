interface FlipCardProps {
    // Cara frontal
    frontTitle: string;
    frontValue: string | number;
    frontColor?: string;

    // Cara trasera
    backTitle: string;
    backValue: string | number;
    backGradient?: string;

    // Estado
    isFlipped: boolean;
    onFlip: () => void;
}

export default function FlipCard({
    frontTitle,
    frontValue,
    frontColor = 'text-gray-900',
    backTitle,
    backValue,
    backGradient = 'bg-indigo-600',
    isFlipped,
    onFlip
}: FlipCardProps) {
    return (
        <div
            className="relative h-32 cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={onFlip}
        >
            <div
                className="absolute w-full h-full transition-all duration-500"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Cara frontal */}
                <div
                    className="absolute w-full h-full bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="text-sm text-gray-600">{frontTitle}</div>
                    <div className={`text-2xl font-bold mt-2 ${frontColor}`}>
                        {frontValue}
                    </div>
                </div>

                {/* Cara trasera */}
                <div
                    className={`absolute w-full h-full ${backGradient} p-6 rounded-lg shadow-md`}
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="text-sm text-white/80">{backTitle}</div>
                    <div className="text-2xl font-bold text-white mt-2">
                        {backValue}
                    </div>
                </div>
            </div>
        </div>
    );
}
