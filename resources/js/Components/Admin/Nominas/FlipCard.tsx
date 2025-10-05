import { ReactNode } from 'react';

interface FlipCardProps {
    title: string;
    value: ReactNode;
    backTitle: string;
    backValue: ReactNode;
    isFlipped: boolean;
    onToggle: () => void;
    frontColor?: string;
    backColor?: string;
}

export default function FlipCard({
    title,
    value,
    backTitle,
    backValue,
    isFlipped,
    onToggle,
    frontColor = 'bg-white',
    backColor = 'bg-indigo-600'
}: FlipCardProps) {
    const textColorClass = backColor.includes('indigo') ? 'text-indigo-200' :
                           backColor.includes('purple') ? 'text-purple-200' :
                           backColor.includes('green') ? 'text-green-200' :
                           backColor.includes('blue') ? 'text-blue-200' : 'text-white';

    return (
        <div
            className="relative h-32 cursor-pointer"
            style={{ perspective: '1000px' }}
            onClick={onToggle}
        >
            <div
                className="absolute w-full h-full transition-all duration-500"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
            >
                {/* Front */}
                <div
                    className={`absolute w-full h-full ${frontColor} p-6 rounded-lg shadow`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <div className="text-sm text-gray-600">{title}</div>
                    <div className="text-2xl font-bold">{value}</div>
                </div>

                {/* Back */}
                <div
                    className={`absolute w-full h-full ${backColor} p-6 rounded-lg shadow`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <div className={`text-sm ${textColorClass}`}>{backTitle}</div>
                    <div className="text-2xl font-bold text-white">{backValue}</div>
                </div>
            </div>
        </div>
    );
}
