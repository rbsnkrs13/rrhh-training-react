import { ChevronDown } from 'lucide-react';
import Dropdown from '@/Components/Shared/Layout/Dropdown';
import type { ConfiguracionDashboard, Mes } from '@/types';

interface HeaderConFiltrosProps {
    configuracion: ConfiguracionDashboard;
    añoSeleccionado: number;
    setAñoSeleccionado: (año: number) => void;
    mesSeleccionado: number;
    setMesSeleccionado: (mes: number) => void;
    añosCompletos: number[];
    meses: Mes[];
}

//Exporta el componente HeaderConFiltros con sus props usadas aqui
export default function HeaderConFiltros({
    configuracion,
    añoSeleccionado,
    setAñoSeleccionado,
    mesSeleccionado,
    setMesSeleccionado,
    añosCompletos,
    meses,
}: HeaderConFiltrosProps) {
    //Y sus styles para los selects (bendita ia)
    const selectStyles = {
        className:
            'px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer',
        style: {
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
        },
    };

    //Render del componente
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    🎯 {configuracion.empresa}{' '}
                    {/* Configuracion que viene de web, sacamos el nombre y la version  */}
                </h1>
                <p className="text-gray-600 mt-1">
                    Dashboard de Recursos Humanos - v{configuracion.version}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
                {/* Select para seleccionar un año, viene de hooks/usePeriodos */}
                <select
                    value={añoSeleccionado}
                    onChange={e => setAñoSeleccionado(parseInt(e.target.value))}
                    {...selectStyles}
                >
                    {añosCompletos.map(año => (
                        <option key={año} value={año}>
                            📅 {año}
                        </option>
                    ))}
                </select>

                {/* Select para seleccionar un año, viene de hooks/usePeriodos */}
                <select
                    value={mesSeleccionado}
                    onChange={e => setMesSeleccionado(parseInt(e.target.value))}
                    {...selectStyles}
                >
                    {meses.map(mes => (
                        <option key={mes.valor} value={mes.valor}>
                            {mes.nombre}
                        </option>
                    ))}
                </select>

                {/* Dropdown Gestión Empleados */}
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors inline-flex items-center space-x-2"
                        >
                            <span>👤 Usuario</span>
                            <ChevronDown className="h-4 w-4" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="right">
                        <Dropdown.Link href="/empleados">
                            Ver Todos los Empleados
                        </Dropdown.Link>
                        <Dropdown.Link href="/empleados/create">
                            Crear Nuevo Empleado
                        </Dropdown.Link>
                        <div className="border-t border-gray-100" />
                        <Dropdown.Link href="/fichajes">
                            Ver Fichajes
                        </Dropdown.Link>
                        <Dropdown.Link href="/nominas">
                            Gestionar Nóminas
                        </Dropdown.Link>
                        <div className="border-t border-gray-100" />
                        <Dropdown.Link href="/profile">
                            Mi Perfil
                        </Dropdown.Link>
                        <Dropdown.Link
                            href="/logout"
                            method="post"
                            as="button"
                        >
                            Cerrar Sesión
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );
}
