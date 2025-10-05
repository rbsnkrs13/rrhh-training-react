import { Link } from '@inertiajs/react';
import FormField from './FormField';
import SelectField from './SelectField';
import TextAreaField from './TextAreaField';

interface FormularioEmpleadoData {
    nombre: string;
    email: string;
    departamento: string;
    puesto: string;
    salario: string;
    fecha_contratacion: string;
    activo: boolean;
    notas: string;
}

interface FormularioEmpleadoProps {
    data: FormularioEmpleadoData;
    setData: (field: string, value: any) => void;
    errors: Record<string, string>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    modo: 'crear' | 'editar';
    empleadoInfo?: {
        nombre: string;
        antiguedad?: string;
    };
}

const departamentos = ['IT', 'RRHH', 'Ventas', 'Marketing', 'Contabilidad', 'Logística'];

const puestos: Record<string, string[]> = {
    IT: ['Desarrollador', 'Analista', 'DevOps', 'QA Tester', 'Arquitecto'],
    RRHH: ['Especialista RRHH', 'Recruiter', 'Nóminas', 'Formación'],
    Ventas: ['Vendedor', 'Account Manager', 'Comercial', 'Preventa'],
    Marketing: ['Marketing Manager', 'Community Manager', 'Diseñador', 'SEO'],
    Contabilidad: ['Contador', 'Auditor', 'Controller', 'Tesorería'],
    Logística: ['Operador', 'Supervisor', 'Coordinador', 'Almacén'],
};

export default function FormularioEmpleado({
    data,
    setData,
    errors,
    processing,
    onSubmit,
    modo,
    empleadoInfo,
}: FormularioEmpleadoProps) {
    const handleDepartamentoChange = (value: string) => {
        setData('departamento', value);
        if (modo === 'crear') {
            setData('puesto', '');
        } else {
            if (!puestos[value]?.includes(data.puesto)) {
                setData('puesto', '');
            }
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    label="Nombre completo *"
                    type="text"
                    value={data.nombre}
                    onChange={(value) => setData('nombre', value)}
                    error={errors.nombre}
                    placeholder="Ej: Ana García Martínez"
                    required
                />

                <FormField
                    label="Email corporativo *"
                    type="email"
                    value={data.email}
                    onChange={(value) => setData('email', value)}
                    error={errors.email}
                    placeholder="ana.garcia@empresa.com"
                    required
                />

                <SelectField
                    label="Departamento *"
                    value={data.departamento}
                    onChange={handleDepartamentoChange}
                    error={errors.departamento}
                    options={departamentos.map(d => ({ value: d, label: d }))}
                    placeholder="Seleccionar departamento"
                    required
                />

                <SelectField
                    label="Puesto *"
                    value={data.puesto}
                    onChange={(value) => setData('puesto', value)}
                    error={errors.puesto}
                    options={(puestos[data.departamento] || []).map(p => ({ value: p, label: p }))}
                    placeholder={data.departamento ? 'Seleccionar puesto' : 'Primero selecciona departamento'}
                    disabled={!data.departamento}
                    required
                />

                <FormField
                    label="Salario anual (€)"
                    type="number"
                    value={data.salario}
                    onChange={(value) => setData('salario', value)}
                    error={errors.salario}
                    placeholder="35000"
                    min="0"
                    step="100"
                />

                <FormField
                    label="Fecha de contratación *"
                    type="date"
                    value={data.fecha_contratacion}
                    onChange={(value) => setData('fecha_contratacion', value)}
                    error={errors.fecha_contratacion}
                    max={new Date().toISOString().split('T')[0]}
                    required
                />
            </div>

            <TextAreaField
                label="Notas adicionales"
                value={data.notas}
                onChange={(value) => setData('notas', value)}
                error={errors.notas}
                placeholder="Información adicional sobre el empleado..."
                rows={3}
            />

            <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={data.activo}
                        onChange={e => setData('activo', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span className="ml-3 text-sm">
                        <span className="font-medium text-gray-900">
                            {data.activo ? '✅ Empleado activo' : '❌ Empleado inactivo'}
                        </span>
                        <span className="block text-gray-500">
                            {data.activo
                                ? modo === 'crear'
                                    ? 'El empleado tendrá acceso al sistema desde el primer día'
                                    : 'El empleado tiene acceso completo al sistema'
                                : modo === 'crear'
                                    ? 'El empleado estará registrado pero sin acceso'
                                    : 'El empleado no podrá acceder al sistema'}
                        </span>
                    </span>
                </label>

                {modo === 'editar' && empleadoInfo?.antiguedad && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            📅 <strong>Antigüedad:</strong> {empleadoInfo.antiguedad} años en la empresa
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
                <Link
                    href={route('admin.empleados.index')}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </Link>
                <button
                    type="submit"
                    disabled={processing || !data.nombre || !data.email || !data.departamento}
                    className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                    {processing ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {modo === 'crear' ? 'Guardando en BD...' : 'Actualizando...'}
                        </>
                    ) : (
                        modo === 'crear' ? '💾 Crear Empleado' : '💾 Actualizar Empleado'
                    )}
                </button>
            </div>
        </form>
    );
}
