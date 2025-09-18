import { User as UserIcon, Calendar, FileText } from 'lucide-react';

interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    cargo: string;
}

interface Props {
    empleadoInfo: Empleado;
}

export default function InformacionPersonal({ empleadoInfo }: Props) {
    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg md:col-span-2">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Mi Información</h3>
                {/* Grid de 3 columnas para la información */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Nombre */}
                    <div className="flex items-center">
                        <UserIcon className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Nombre</p>
                            <p className="font-medium">{empleadoInfo.nombre}</p>
                        </div>
                    </div>
                    {/* Departamento */}
                    <div className="flex items-center">
                        <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Departamento</p>
                            <p className="font-medium">{empleadoInfo.departamento}</p>
                        </div>
                    </div>
                    {/* Cargo */}
                    <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                            <p className="text-sm text-gray-600">Cargo</p>
                            <p className="font-medium">{empleadoInfo.cargo}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}