import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';
import FiltroAvanzado from '@/Components/FiltrosAvanzados';

export default function Empleados({ empleados }) {
    const { flash } = usePage().props;
    const [expandidos, setExpandidos] = useState({});

    const [filtros, setFiltros] = useState({
        busqueda: '',
        departamento: 'todos',
        estado: 'todos',
        ordenPor: 'nombre'
    });

    const toggleExpandido = (empleadoId) => {
        setExpandidos(prev => ({
            ...prev,
            [empleadoId]: !prev[empleadoId]
        }));
    };

    // Aplicar todos los filtros
    const empleadosFiltrados = empleados
        .filter(empleado => {
            // Filtro por búsqueda
            const coincideBusqueda = empleado.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());

            // Filtro por departamento
            const coincideDepartamento = filtros.departamento === 'todos' || empleado.departamento === filtros.departamento;

            // Filtro por estado
            const coincideEstado = filtros.estado === 'todos' ||
                (filtros.estado === 'activo' && empleado.activo) ||
                (filtros.estado === 'inactivo' && !empleado.activo);

            return coincideBusqueda && coincideDepartamento && coincideEstado;
        })
        .sort((a, b) => {
            // Aplicar ordenamiento
            switch (filtros.ordenPor) {
                case 'nombre':
                    return a.nombre.localeCompare(b.nombre);
                case 'nombre-desc':
                    return b.nombre.localeCompare(a.nombre);
                case 'departamento':
                    return a.departamento.localeCompare(b.departamento);
                case 'estado':
                    return b.activo - a.activo; // Activos primero
                default:
                    return 0;
            }
        });

    // Departamentos únicos
    const departamentos = [...new Set(empleados.map(emp => emp.departamento))];

    const manejarCambioFiltros = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                👥 Gestión de Empleados
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Mostrando {empleadosFiltrados.length} de {empleados.length} empleados
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-4 sm:mt-0">
                            <Link
                                href="/empleados/create"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                ➕ Nuevo Empleado
                            </Link>
                            <Link
                                href="/"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                ← Dashboard
                            </Link>
                        </div>
                    </div>

                    {/* Filtros avanzados */}
                    <FiltroAvanzado
                        onFiltroChange={manejarCambioFiltros}
                        departamentos={departamentos}
                    />

                    {/* Lista de empleados */}
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Empleados ({empleadosFiltrados.length})
                            </h2>
                        </div>

                        <div className="p-6">
                            {empleadosFiltrados.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-xl text-gray-500 mb-2">No se encontraron empleados</p>
                                    <p className="text-gray-400">
                                        {filtros.busqueda || filtros.departamento !== 'todos' || filtros.estado !== 'todos'
                                            ? 'Prueba ajustando los filtros de búsqueda'
                                            : 'No hay empleados registrados en el sistema'
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {empleadosFiltrados.map(empleado => (
                                        <div key={empleado.id} className="border border-gray-200 rounded-lg hover:border-blue-300 transition-all duration-200">

                                            {/* HEADER COMPACTO - Siempre visible */}
                                            <div
                                                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                                                onClick={() => toggleExpandido(empleado.id)}
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-3 h-3 rounded-full ${empleado.activo ? 'bg-green-400' : 'bg-red-400'}`}></div>

                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-900">{empleado.nombre}</h3>
                                                        <p className="text-sm text-gray-600">{empleado.departamento} • {empleado.puesto || 'Sin puesto'}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${empleado.activo
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {empleado.activo ? 'Activo' : 'Inactivo'}
                                                    </span>

                                                    {/* Icono expandir/contraer */}
                                                    <div className="text-gray-400">
                                                        {expandidos[empleado.id] ? '🔽' : '▶️'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DETALLE EXPANDIBLE - Solo si está expandido */}
                                            {expandidos[empleado.id] && (
                                                <div className="border-t border-gray-100 bg-gray-50">
                                                    <div className="p-4">
                                                        {/* Grid con información detallada */}
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
                                                                            €{parseFloat(empleado.salario).toLocaleString()}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400">No especificado</span>
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded-lg">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Fecha contratación</p>
                                                                <p className="font-medium text-gray-900 mt-1">
                                                                    {new Date(empleado.fecha_contratacion).toLocaleDateString('es-ES', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded-lg">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Antigüedad</p>
                                                                <p className="font-medium text-gray-900 mt-1">
                                                                    <span className="text-blue-600 font-semibold">
                                                                        {empleado.antiguedad ? `${empleado.antiguedad} años` : 'Menos de 1 año'}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded-lg">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Estado</p>
                                                                <p className="font-medium mt-1">
                                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${empleado.activo
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {empleado.activo ? '✅ Activo' : '❌ Inactivo'}
                                                                    </span>
                                                                </p>
                                                            </div>

                                                            <div className="bg-white p-3 rounded-lg">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide">ID</p>
                                                                <p className="font-medium text-gray-900 mt-1 font-mono text-sm">#{empleado.id}</p>
                                                            </div>
                                                        </div>

                                                        {/* Notas si existen */}
                                                        {empleado.notas && (
                                                            <div className="bg-white p-4 rounded-lg mb-4">
                                                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Notas</p>
                                                                <p className="text-sm text-gray-700 leading-relaxed">{empleado.notas}</p>
                                                            </div>
                                                        )}

                                                        {/* Botones de acción */}
                                                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                                            <Link
                                                                href={`/empleados/${empleado.id}/edit`}
                                                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
                                                                onClick={(e) => e.stopPropagation()} // Evitar que se cierre al hacer clic
                                                            >
                                                                <span>✏️</span>
                                                                <span>Editar</span>
                                                            </Link>

                                                            <Link
                                                                href={`/empleados/${empleado.id}`}
                                                                method="delete"
                                                                as="button"
                                                                className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors flex items-center space-x-2"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Evitar que se cierre al hacer clic
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
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}