// Importaciones necesarias para el componente
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User } from '@/types';
// Componentes
import BienvenidaReloj from '@/Components/Employee/BienvenidaReloj';
import EstadoFichaje from '@/Components/Employee/EstadoFichaje';
import FichajeRapido from '@/Components/Employee/FichajeRapido';
import ResumenSemanalHoras from '@/Components/Employee/ResumenSemanalHoras';
import NominasRecientes from '@/Components/Employee/NominasRecientes';
import FichajesRecientes from '@/Components/Employee/FichajesRecientes';
import InformacionPersonal from '@/Components/Employee/InformacionPersonal';
// Hooks de React para estado y efectos
import { useState, useEffect } from 'react';

// ===== INTERFACES - Definen la estructura de datos =====

// Estructura de un fichaje (entrada/salida)
interface Fichaje {
    id: number;
    tipo: 'entrada' | 'salida';
    fecha_hora: string;
}

// Estructura de una nómina
interface Nomina {
    id: number;
    mes: string;
    año: number;
    archivo: string;
}

// Estructura de información del empleado
interface Empleado {
    id: number;
    nombre: string;
    departamento: string;
    cargo: string;
}

// Props que recibe el componente desde Laravel
interface Props {
    auth: {
        user: User;
    };
    fichajesRecientes?: Fichaje[];      // Últimos fichajes del empleado
    nominasRecientes?: Nomina[];        // Últimas nóminas disponibles
    empleadoInfo?: Empleado;           // Información personal del empleado
    estadoFichaje?: {                  // Estado actual de fichaje
        fichado: boolean;
        ultimaEntrada?: string;
        horasHoy: number;
    };
    horasSemana?: {                    // Resumen semanal de horas
        trabajadas: number;
        objetivo: number;
    };
}

// ===== COMPONENTE PRINCIPAL =====
export default function EmpleadoDashboard({
    auth,
    fichajesRecientes = [],     // Valor por defecto: array vacío
    nominasRecientes = [],      // Valor por defecto: array vacío
    empleadoInfo,
    estadoFichaje,
    horasSemana
}: Props) {

    // ===== ESTADO Y EFECTOS =====

    // Estado para mostrar la hora actual en tiempo real
    const [currentTime, setCurrentTime] = useState(new Date());

    // Efecto para actualizar la hora cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup: limpiar el timer cuando el componente se desmonte
        return () => clearInterval(timer);
    }, []);

    // ===== FUNCIONES AUXILIARES =====

    // Función para manejar fichajes (entrada/salida)
    const handleFichaje = (tipo: 'entrada' | 'salida') => {
        router.post(route(`fichajes.${tipo}`), {}, {
            preserveState: true,    // Mantener estado actual
            preserveScroll: true,   // Mantener posición de scroll
        });
    };

    // Formatear hora en formato español (HH:MM)
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Formatear fecha en formato español completo
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // ===== RENDER DEL COMPONENTE =====
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            {/* Título de la página para SEO */}
            <Head title="Panel de Empleado" />

            {/* Contenedor principal con fondo gris claro */}
            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Grid responsivo: 1 columna en móvil, 2 en desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* ===== WIDGET 1: BIENVENIDA + RELOJ ===== */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    {/* Saludo personalizado */}
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            ¡Hola, {auth.user.name}!
                                        </h3>
                                        <p className="text-gray-600 mt-1">
                                            {formatDate(currentTime)}
                                        </p>
                                    </div>
                                    {/* Reloj en tiempo real */}
                                    <div className="flex items-center text-2xl font-bold text-blue-600">
                                        <Clock className="w-6 h-6 mr-2" />
                                        {formatTime(currentTime)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ===== WIDGET 2: ESTADO DE FICHAJE ===== */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Estado Actual</h3>
                                {/* Condicional: mostrar estado según si está fichado o no */}
                                {estadoFichaje?.fichado ? (
                                    // Empleado fichado (verde)
                                    <div className="flex items-center text-green-600">
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        <div>
                                            <p className="font-medium">Fichado desde las {estadoFichaje.ultimaEntrada}</p>
                                            <p className="text-sm text-gray-600">
                                                Horas hoy: {estadoFichaje.horasHoy.toFixed(1)}h
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    // Empleado no fichado (gris)
                                    <div className="flex items-center text-gray-500">
                                        <XCircle className="w-5 h-5 mr-2" />
                                        <p>No fichado</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ===== WIDGET 3: BOTONES DE FICHAJE RÁPIDO ===== */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Fichaje Rápido</h3>
                                {/* Grid de 2 columnas para los botones */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Botón de Entrada - Verde */}
                                    <button
                                        onClick={() => handleFichaje('entrada')}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                                        disabled={estadoFichaje?.fichado} // Deshabilitar si ya está fichado
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Entrada
                                    </button>
                                    {/* Botón de Salida - Rojo */}
                                    <button
                                        onClick={() => handleFichaje('salida')}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50"
                                        disabled={!estadoFichaje?.fichado} // Deshabilitar si no está fichado
                                    >
                                        <XCircle className="w-5 h-5 mr-2" />
                                        Salida
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ===== WIDGET 4: RESUMEN SEMANAL DE HORAS ===== */}
                        {horasSemana && <ResumenSemanalHoras horasSemana={horasSemana} />}

                        {/* ===== WIDGET 5: ÚLTIMAS NÓMINAS ===== */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                {/* Header con enlace a "Ver todas" */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Mis Nóminas</h3>
                                    <a
                                        href={route('nominas.index')}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Ver todas
                                    </a>
                                </div>
                                {/* Lista de nóminas */}
                                <div className="space-y-3">
                                    {nominasRecientes.length > 0 ? (
                                        // Mostrar máximo 3 nóminas
                                        nominasRecientes.slice(0, 3).map((nomina) => (
                                            <div key={nomina.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <FileText className="w-4 h-4 text-gray-500 mr-2" />
                                                    <span className="text-sm font-medium">
                                                        {nomina.mes} {nomina.año}
                                                    </span>
                                                </div>
                                                {/* Enlace de descarga */}
                                                <a
                                                    href={route('nominas.descargar', nomina.id)}
                                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                                >
                                                    Descargar
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        // Mensaje cuando no hay nóminas
                                        <p className="text-gray-600 text-sm">No hay nóminas disponibles</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== WIDGET 6: FICHAJES RECIENTES ===== */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Fichajes Recientes</h3>
                                <div className="space-y-3">
                                    {fichajesRecientes.length > 0 ? (
                                        // Mostrar máximo 5 fichajes
                                        fichajesRecientes.slice(0, 5).map((fichaje) => (
                                            <div key={fichaje.id} className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    {/* Icono según tipo de fichaje */}
                                                    {fichaje.tipo === 'entrada' ? (
                                                        <Clock className="w-4 h-4 text-blue-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4 text-red-500 mr-2" />
                                                    )}
                                                    <span className="text-sm capitalize">{fichaje.tipo}</span>
                                                </div>
                                                {/* Fecha y hora del fichaje */}
                                                <span className="text-sm text-gray-600">
                                                    {(() => {
                                                        // Formato: "2024-09-17 08:22:00"
                                                        const [fecha, hora] = fichaje.fecha_hora.split(' ');
                                                        const [año, mes, dia] = fecha.split('-');
                                                        const [horas, minutos] = hora.split(':');
                                                        return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
                                                    })()}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        // Mensaje cuando no hay fichajes
                                        <p className="text-gray-600 text-sm">No hay fichajes recientes</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ===== WIDGET 7: INFORMACIÓN PERSONAL ===== */}
                        {/* Solo mostrar si hay información del empleado */}
                        {empleadoInfo && (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg md:col-span-2">
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Mi Información</h3>
                                    {/* Grid de 3 columnas para la información */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Nombre */}
                                        <div className="flex items-center">
                                            <UserIcon className="w-5 h-5 text-gray-500 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Nombre</p>
                                                <p className="font-medium">{empleadoInfo.nombre}</p>
                                            </div>
                                        </div>
                                        {/* Departamento */}
                                        <div className="flex items-center">
                                            <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Departamento</p>
                                                <p className="font-medium">{empleadoInfo.departamento}</p>
                                            </div>
                                        </div>
                                        {/* Cargo */}
                                        <div className="flex items-center">
                                            <FileText className="w-5 h-5 text-gray-500 mr-2" />
                                            <div>
                                                <p className="text-sm text-gray-600">Cargo</p>
                                                <p className="font-medium">{empleadoInfo.cargo}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}