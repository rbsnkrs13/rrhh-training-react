import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import FiltroAvanzado from '@/Components/Admin/Empleados/FiltrosAvanzados';
import HeaderEmpleados from '@/Components/Admin/Empleados/HeaderEmpleados';
import ListaEmpleados from '@/Components/Admin/Empleados/ListaEmpleados';
import { useFiltrosEmpleados } from '@/Hooks/useFiltrosEmpleados';
import type { EmpleadosProps } from '@/types';

export default function Empleados({ empleados }: EmpleadosProps) {
    const { filtros, setFiltros, empleadosFiltrados, departamentos } = useFiltrosEmpleados(empleados);

    return (
        <AuthenticatedLayout>
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <FlashMessage />

                    <HeaderEmpleados
                        totalEmpleados={empleados.length}
                        empleadosFiltrados={empleadosFiltrados.length}
                    />

                    <FiltroAvanzado
                        onFiltroChange={setFiltros}
                        departamentos={departamentos}
                    />

                    <ListaEmpleados
                        empleados={empleadosFiltrados}
                        filtros={filtros}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
