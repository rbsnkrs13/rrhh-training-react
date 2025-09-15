import { useForm, Link, usePage } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';

export default function CrearEmpleado() {
    const { flash } = usePage().props;
    
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        email: '',
        departamento: '',
        puesto: '',
        salario: '',
        fecha_contratacion: '',
        activo: true,
        notas: ''
    });

    const departamentos = ['IT', 'RRHH', 'Ventas', 'Marketing', 'Contabilidad', 'Logística'];
    
    const puestos = {
        'IT': ['Desarrollador', 'Analista', 'DevOps', 'QA Tester', 'Arquitecto'],
        'RRHH': ['Especialista RRHH', 'Recruiter', 'Nóminas', 'Formación'],
        'Ventas': ['Vendedor', 'Account Manager', 'Comercial', 'Preventa'],
        'Marketing': ['Marketing Manager', 'Community Manager', 'Diseñador', 'SEO'],
        'Contabilidad': ['Contador', 'Auditor', 'Controller', 'Tesorería'],
        'Logística': ['Operador', 'Supervisor', 'Coordinador', 'Almacén']
    };

    const enviarFormulario = (e) => {
        e.preventDefault();
        
        post(route('empleados.store'), {
            onSuccess: () => {
                console.log('✅ Empleado creado en BD');
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4">
                    {flash?.success && <FlashMessage message={flash.success} type="success" />}
                    {flash?.error && <FlashMessage message={flash.error} type="error" />}
                    
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            ➕ Crear Nuevo Empleado
                        </h1>
                        
                        <Link 
                            href={route('empleados.index')}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            ← Cancelar
                        </Link>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={enviarFormulario} className="space-y-6">
                            {/* Grid de 2 columnas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Ana García Martínez"
                                        required
                                    />
                                    {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email corporativo *
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ana.garcia@empresa.com"
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                </div>

                                {/* Departamento */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Departamento *
                                    </label>
                                    <select
                                        value={data.departamento}
                                        onChange={(e) => {
                                            setData('departamento', e.target.value);
                                            setData('puesto', ''); // Reset puesto
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Seleccionar departamento</option>
                                        {departamentos.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                    {errors.departamento && <p className="mt-1 text-sm text-red-600">{errors.departamento}</p>}
                                </div>

                                {/* Puesto */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Puesto *
                                    </label>
                                    <select
                                        value={data.puesto}
                                        onChange={(e) => setData('puesto', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                        disabled={!data.departamento}
                                    >
                                        <option value="">
                                            {data.departamento ? 'Seleccionar puesto' : 'Primero selecciona departamento'}
                                        </option>
                                        {data.departamento && puestos[data.departamento]?.map(puesto => (
                                            <option key={puesto} value={puesto}>{puesto}</option>
                                        ))}
                                    </select>
                                    {errors.puesto && <p className="mt-1 text-sm text-red-600">{errors.puesto}</p>}
                                </div>

                                {/* Salario */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salario anual (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.salario}
                                        onChange={(e) => setData('salario', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="35000"
                                        min="0"
                                        step="100"
                                    />
                                    {errors.salario && <p className="mt-1 text-sm text-red-600">{errors.salario}</p>}
                                </div>

                                {/* Fecha contratación */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Fecha de contratación *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.fecha_contratacion}
                                        onChange={(e) => setData('fecha_contratacion', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                    {errors.fecha_contratacion && <p className="mt-1 text-sm text-red-600">{errors.fecha_contratacion}</p>}
                                </div>
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notas adicionales
                                </label>
                                <textarea
                                    value={data.notas}
                                    onChange={(e) => setData('notas', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Información adicional sobre el empleado..."
                                />
                                {errors.notas && <p className="mt-1 text-sm text-red-600">{errors.notas}</p>}
                            </div>

                            {/* Estado */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.activo}
                                        onChange={(e) => setData('activo', e.target.checked)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                    />
                                    <span className="ml-3 text-sm">
                                        <span className="font-medium text-gray-900">
                                            {data.activo ? '✅ Empleado activo' : '❌ Empleado inactivo'}
                                        </span>
                                        <span className="block text-gray-500">
                                            {data.activo 
                                                ? 'El empleado tendrá acceso al sistema desde el primer día' 
                                                : 'El empleado estará registrado pero sin acceso'
                                            }
                                        </span>
                                    </span>
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="flex justify-end space-x-3 pt-6 border-t">
                                <Link 
                                    href={route('empleados.index')}
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
                                            Guardando en BD...
                                        </>
                                    ) : (
                                        '💾 Crear Empleado'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}