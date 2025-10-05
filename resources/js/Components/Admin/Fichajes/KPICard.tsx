import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    icon: LucideIcon;
    value: string | number;
    label: string;
    color: 'blue' | 'green' | 'red' | 'purple';
}

const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    purple: 'text-purple-600'
};

export default function KPICard({ icon: Icon, value, label, color }: KPICardProps) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
                </div>
                <div className="ml-4">
                    <div className={`text-2xl font-bold ${colorClasses[color]}`}>
                        {value}
                    </div>
                    <div className="text-xs text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    );
}
