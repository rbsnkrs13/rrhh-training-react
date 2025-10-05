import { useForm, Link } from '@inertiajs/react';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import FormularioEmpleado from '@/Components/Admin/Empleados/FormularioEmpleado';
import type { Empleado } from '@/types';

interface EditarEmpleadoProps {
    empleado: Empleado;
}

export default function EditarEmpleado({ empleado }: EditarEmpleadoProps) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: empleado.nombre,
        email: empleado.email,
        departamento: empleado.departamento,
        puesto: empleado.puesto || '',
        salario: empleado.salario || '',
        fecha_contratacion: empleado.fecha_contratacion,
        activo: empleado.activo,
        notas: empleado.notas || '',
    });

    const enviarFormulario = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/empleados/${empleado.id}`, {
            onSuccess: () => {
                console.log('✅ Empleado actualizado en BD');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <FlashMessage />

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">✏️ Editar Empleado</h1>
                            <p className="text-gray-600 mt-1">
                                Modificando datos de:{' '}
                                <span className="font-semibold">{empleado.nombre}</span>
                            </p>
                        </div>

                        <Link
                            href={route('admin.empleados.index')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            ← Cancelar
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <FormularioEmpleado
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={enviarFormulario}
                            modo="editar"
                            empleadoInfo={{
                                nombre: empleado.nombre,
                                antiguedad: empleado.antiguedad,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
