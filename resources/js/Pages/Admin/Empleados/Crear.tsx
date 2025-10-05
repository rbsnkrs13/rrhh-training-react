import { useForm, Link } from '@inertiajs/react';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';
import FormularioEmpleado from '@/Components/Admin/Empleados/FormularioEmpleado';

export default function CrearEmpleado() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        departamento: '',
        puesto: '',
        salario: '',
        fecha_contratacion: '',
        activo: true,
        notas: '',
    });

    const enviarFormulario = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.empleados.store'), {
            onSuccess: () => {
                console.log('✅ Empleado creado en BD');
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <FlashMessage />

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            ➕ Crear Nuevo Empleado
                        </h1>

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
                            modo="crear"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
