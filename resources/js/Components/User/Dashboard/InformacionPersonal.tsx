import { User as UserIcon, Calendar, FileText } from 'lucide-react';

interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    cargo: string;
}

interface InformacionPersonalProps {
    empleado: Empleado;
}

export default function InformacionPersonal({ empleado }: InformacionPersonalProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm overflow-hidden shadow-lg sm:rounded-xl border border-orange-100 md:col-span-2">
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-orange-600" />
                    Mi Información
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border border-orange-100">
                        <div className="flex items-center mb-2">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <UserIcon className="w-4 h-4 text-orange-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">Nombre</p>
                        <p className="font-semibold text-gray-900">{empleado.nombre}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">Departamento</p>
                        <p className="font-semibold text-gray-900">{empleado.departamento}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                        <div className="flex items-center mb-2">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FileText className="w-4 h-4 text-purple-600" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">Cargo</p>
                        <p className="font-semibold text-gray-900">{empleado.cargo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}