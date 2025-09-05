import { useState } from 'react';

export default function FiltroAvanzado({ onFiltroChange, departamentos }) {
    const [filtros, setFiltros] = useState({
        busqueda: '',
        departamento: 'todos',
        estado: 'todos',
        ordenPor: 'nombre'
    });

    const aplicarFiltro = (nuevosFiltros) => {
        setFiltros(nuevosFiltros);
        onFiltroChange(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        const filtrosLimpios = {
            busqueda: '',
            departamento: 'todos',
            estado: 'todos',
            ordenPor: 'nombre'
        };
        aplicarFiltro(filtrosLimpios);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">🔍 Filtros Avanzados</h3>
                <button
                    onClick={limpiarFiltros}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    🗑️ Limpiar filtros
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Búsqueda por nombre */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar empleado
                    </label>
                    <input
                        type="text"
                        placeholder="Nombre del empleado..."
                        value={filtros.busqueda}
                        onChange={(e) => aplicarFiltro({...filtros, busqueda: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Filtro por departamento */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Departamento
                    </label>
                    <select
                        value={filtros.departamento}
                        onChange={(e) => aplicarFiltro({...filtros, departamento: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">📋 Todos los departamentos</option>
                        {departamentos.map(dept => (
                            <option key={dept} value={dept}>
                                {dept === 'IT' ? '💻' : dept === 'RRHH' ? '👥' : dept === 'Ventas' ? '💰' : dept === 'Marketing' ? '📢' : '📊'} {dept}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Filtro por estado */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        value={filtros.estado}
                        onChange={(e) => aplicarFiltro({...filtros, estado: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="todos">👥 Todos los empleados</option>
                        <option value="activo">✅ Solo activos</option>
                        <option value="inactivo">❌ Solo inactivos</option>
                    </select>
                </div>

                {/* Ordenar por */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordenar por
                    </label>
                    <select
                        value={filtros.ordenPor}
                        onChange={(e) => aplicarFiltro({...filtros, ordenPor: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="nombre">📝 Nombre (A-Z)</option>
                        <option value="nombre-desc">📝 Nombre (Z-A)</option>
                        <option value="departamento">🏢 Departamento</option>
                        <option value="estado">⚡ Estado</option>
                    </select>
                </div>
            </div>

            {/* Resumen de filtros activos */}
            {(filtros.busqueda || filtros.departamento !== 'todos' || filtros.estado !== 'todos') && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        🔍 <strong>Filtros activos:</strong>
                        {filtros.busqueda && ` Búsqueda: "${filtros.busqueda}"`}
                        {filtros.departamento !== 'todos' && ` | Departamento: ${filtros.departamento}`}
                        {filtros.estado !== 'todos' && ` | Estado: ${filtros.estado}`}
                    </p>
                </div>
            )}
        </div>
    );
}