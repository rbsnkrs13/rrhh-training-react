import { Link } from '@inertiajs/react';

interface Empleado {
    id: number;
    nombre: string;
    email: string;
    departamento: string;
    puesto?: string;
    salario?: number;
    fecha_contratacion: string;
    antiguedad?: number;
    activo: boolean;
    notas?: string;
}

interface TarjetaEmpleadoProps {
    empleado: Empleado;
    expandido: boolean;
    onToggle: () => void;
}

export default function TarjetaEmpleado({ empleado, expandido, onToggle }: TarjetaEmpleadoProps) {
    return (
        <div className="border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">
            {/* Header compacto */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={onToggle}
            >
                <div className="flex items-center space-x-4">
                    <div
                        className={`w-3 h-3 rounded-full ${empleado.activo ? 'bg-green-400' : 'bg-red-400'}`}
                    />
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                            {empleado.nombre}
                        </h3>
                        <p className="text-sm text-gray-600">
                            {empleado.departamento} • {empleado.puesto || 'Sin puesto'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                            empleado.activo
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                        }`}
                    >
                        {empleado.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="text-gray-400">
                        {expandido ? '🔽' : '▶️'}
                    </div>
                </div>
            </div>

            {/* Detalle expandible */}
            {expandido && (
                <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="font-medium text-gray-900 mt-1">{empleado.email}</p>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Salario</p>
                                <p className="font-medium text-gray-900 mt-1">
                                    {empleado.salario ? (
                                        <span className="text-green-600 font-semibold">
                                            €{parseFloat(empleado.salario.toString()).toLocaleString()}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">No especificado</span>
                                    )}
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Fecha contratación
                                </p>
                                <p className="font-medium text-gray-900 mt-1">
                                    {new Date(empleado.fecha_contratacion).toLocaleDateString('es-ES', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Antigüedad</p>
                                <p className="font-medium text-gray-900 mt-1">
                                    <span className="text-blue-600 font-semibold">
                                        {empleado.antiguedad
                                            ? `${empleado.antiguedad} años`
                                            : 'Menos de 1 año'}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Estado</p>
                                <p className="font-medium mt-1">
                                    <span
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                            empleado.activo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {empleado.activo ? '✅ Activo' : '❌ Inactivo'}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-white p-3 rounded-lg">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">ID</p>
                                <p className="font-medium text-gray-900 mt-1 font-mono text-sm">
                                    #{empleado.id}
                                </p>
                            </div>
                        </div>

                        {empleado.notas && (
                            <div className="bg-white p-4 rounded-lg mb-4">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                                    Notas
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {empleado.notas}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                            <Link
                                href={`/admin/empleados/${empleado.id}/edit`}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                onClick={e => e.stopPropagation()}
                            >
                                <span>✏️</span>
                                <span>Editar</span>
                            </Link>

                            <Link
                                href={`/admin/empleados/${empleado.id}`}
                                method="delete"
                                as="button"
                                className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
                                onClick={e => {
                                    e.stopPropagation();
                                    if (!confirm(`¿Estás seguro de eliminar a ${empleado.nombre}?`)) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <span>🗑️</span>
                                <span>Eliminar</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
