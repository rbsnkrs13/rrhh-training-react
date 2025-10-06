import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    Clock,
    FileText,
    TrendingUp,
    MapPin
} from 'lucide-react';

interface Empleado {
    id: number;
    nombre: string;
    email: string;
    telefono: string | null;
    direccion: string | null;
    ciudad: string | null;
    codigo_postal: string | null;
    dni: string | null;
    fecha_nacimiento: string | null;
    fecha_contratacion: string;
    departamento: string;
    cargo: string;
    salario: number;
    estado: string;
    contrato?: {
        tipo_contrato: string;
        horas_semanales: number;
        fecha_inicio: string;
        fecha_fin: string | null;
    };
}

interface Fichaje {
    id: number;
    fecha: string;
    hora: string;
    tipo: string;
}

interface Nomina {
    id: number;
    mes: number;
    año: number;
    nombre_mes: string;
    salario_bruto: number;
    salario_neto: number;
    estado: string;
}

interface Estadisticas {
    total_fichajes: number;
    horas_mes_actual: number;
    dias_trabajados_mes: number;
}

interface Props {
    empleado: Empleado;
    fichajes: Fichaje[];
    nominas: Nomina[];
    estadisticas: Estadisticas;
}

export default function Ver({ empleado, fichajes, nominas, estadisticas }: Props) {
    const [tabActiva, setTabActiva] = useState<'info' | 'fichajes' | 'nominas' | 'stats'>('info');

    const formatearSalario = (salario: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(salario);
    };

    const formatearFecha = (fecha: string) => {
        return new Date(fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Empleado: ${empleado.nombre}`} />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Botón volver */}
                    <Link
                        href={route('admin.empleados.index')}
                        className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver a empleados
                    </Link>

                    {/* Header con información principal */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                    <User className="w-16 h-16 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-2">{empleado.nombre}</h1>
                                    <p className="text-blue-100 text-lg mb-3">{empleado.cargo} · {empleado.departamento}</p>
                                    <div className="flex items-center space-x-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            empleado.estado === 'activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {empleado.estado === 'activo' ? '✓ Activo' : '✕ Inactivo'}
                                        </span>
                                        {empleado.contrato && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white">
                                                {empleado.contrato.tipo_contrato}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-100 text-sm mb-1">Salario</p>
                                <p className="text-3xl font-bold text-white">{formatearSalario(empleado.salario)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setTabActiva('info')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        tabActiva === 'info'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <User className="w-5 h-5 inline mr-2" />
                                    Información
                                </button>
                                <button
                                    onClick={() => setTabActiva('fichajes')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        tabActiva === 'fichajes'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Clock className="w-5 h-5 inline mr-2" />
                                    Fichajes ({fichajes.length})
                                </button>
                                <button
                                    onClick={() => setTabActiva('nominas')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        tabActiva === 'nominas'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <FileText className="w-5 h-5 inline mr-2" />
                                    Nóminas ({nominas.length})
                                </button>
                                <button
                                    onClick={() => setTabActiva('stats')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                        tabActiva === 'stats'
                                            ? 'border-blue-600 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <TrendingUp className="w-5 h-5 inline mr-2" />
                                    Estadísticas
                                </button>
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* Tab: Información */}
                            {tabActiva === 'info' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos Personales</h3>

                                        <div className="flex items-center space-x-3">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium">{empleado.email}</p>
                                            </div>
                                        </div>

                                        {empleado.telefono && (
                                            <div className="flex items-center space-x-3">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Teléfono</p>
                                                    <p className="font-medium">{empleado.telefono}</p>
                                                </div>
                                            </div>
                                        )}

                                        {empleado.dni && (
                                            <div className="flex items-center space-x-3">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">DNI</p>
                                                    <p className="font-medium">{empleado.dni}</p>
                                                </div>
                                            </div>
                                        )}

                                        {empleado.fecha_nacimiento && (
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                                                    <p className="font-medium">{formatearFecha(empleado.fecha_nacimiento)}</p>
                                                </div>
                                            </div>
                                        )}

                                        {(empleado.direccion || empleado.ciudad) && (
                                            <div className="flex items-start space-x-3">
                                                <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Dirección</p>
                                                    <p className="font-medium">
                                                        {empleado.direccion}
                                                        {empleado.ciudad && `, ${empleado.ciudad}`}
                                                        {empleado.codigo_postal && ` (${empleado.codigo_postal})`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Laboral</h3>

                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Cargo</p>
                                                <p className="font-medium">{empleado.cargo}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Briefcase className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Departamento</p>
                                                <p className="font-medium">{empleado.departamento}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <Calendar className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Fecha de Contratación</p>
                                                <p className="font-medium">{formatearFecha(empleado.fecha_contratacion)}</p>
                                            </div>
                                        </div>

                                        {empleado.contrato && (
                                            <>
                                                <div className="flex items-center space-x-3">
                                                    <FileText className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tipo de Contrato</p>
                                                        <p className="font-medium">{empleado.contrato.tipo_contrato}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <Clock className="w-5 h-5 text-gray-400" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Horas Semanales</p>
                                                        <p className="font-medium">{empleado.contrato.horas_semanales}h</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Fichajes */}
                            {tabActiva === 'fichajes' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Últimos 30 Fichajes</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {fichajes.map((fichaje) => (
                                                    <tr key={fichaje.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {formatearFecha(fichaje.fecha)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {fichaje.hora}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                fichaje.tipo === 'entrada'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {fichaje.tipo === 'entrada' ? '→ Entrada' : '← Salida'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Tab: Nóminas */}
                            {tabActiva === 'nominas' && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial de Nóminas</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {nominas.map((nomina) => (
                                            <div key={nomina.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">{nomina.nombre_mes} {nomina.año}</h4>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        nomina.estado === 'vista'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                        {nomina.estado}
                                                    </span>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Bruto:</span>
                                                        <span className="font-medium">{formatearSalario(nomina.salario_bruto)}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-500">Neto:</span>
                                                        <span className="font-medium text-green-600">{formatearSalario(nomina.salario_neto)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab: Estadísticas */}
                            {tabActiva === 'stats' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-600">Total Fichajes</h4>
                                            <Clock className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{estadisticas.total_fichajes}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-600">Horas Mes Actual</h4>
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{estadisticas.horas_mes_actual.toFixed(2)}h</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-sm font-medium text-gray-600">Días Trabajados</h4>
                                            <Calendar className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900">{estadisticas.dias_trabajados_mes}</p>
                                        <p className="text-sm text-gray-500 mt-1">Este mes</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
