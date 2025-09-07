import MetricCard from "@/Components/MetricCard";
import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import useMetricas from '@/Hooks/useMetricas';
import useDepartamentos from '@/Hooks/useDepartamentos';
import usePeriodos from '@/Hooks/usePeriodos';
import HeaderConFiltros from '@/Components/Dashboard/HeaderConFiltros';
import MetricasPrincipales from '@/Components/Dashboard/MetricasPrincipales';
import MetricasSecundarias from '@/Components/Dashboard/MetricasSecundarias';
import SeccionDepartamentos from '@/Components/Dashboard/SeccionDepartamentos';

export default function Dashboard({ empleadosIniciales, configuracion }) { //Datos importados de web.php
    // Estado para el período seleccionado que despues se usaran en los botones
    const [empleados] = useState(empleadosIniciales); //Viene de web.php 
    // Estados para efectos visuales
    const [animacionActiva, setAnimacionActiva] = useState(false);

    const {
        añoSeleccionado,
        mesSeleccionado,
        setAñoSeleccionado,
        setMesSeleccionado,
        meses,
        añosCompletos
    } = usePeriodos(empleados);

    const { metricas, cargandoMetricas, simularCarga } = useMetricas(
        empleados,
        añoSeleccionado,
        mesSeleccionado
    );

    const { departamentos, deptoMayorEmpleados } = useDepartamentos(empleados);


    // useEffect optimizado - solo maneja animaciones
    useEffect(() => {
        setAnimacionActiva(true);
        const cleanup = simularCarga();

        const timer = setTimeout(() => {
            setAnimacionActiva(false);
        }, 300);

        return () => {
            clearTimeout(timer);
            if (cleanup) cleanup();
        };
    }, [añoSeleccionado, mesSeleccionado, simularCarga]);

    // useEffect para logging - separado por responsabilidad
    useEffect(() => {
        if (!cargandoMetricas) {
            console.log('📊 Métricas actualizadas:', {
                período: `${meses.find(m => m.valor === mesSeleccionado)?.nombre} ${añoSeleccionado}`,
                empleadosContratados: metricas.empleadosContratadosMes,
                totalEmpleados: metricas.totalEmpleados,
                ratioRetención: `${metricas.ratioRetencion.toFixed(1)}%`
            });

            // Alertas inteligentes
            if (metricas.empleadosContratadosMes === 0) {
                console.log('⚠️ Alerta: No hay contrataciones en este período');
            }
            if (metricas.ratioRetencion < 70) {
                console.log('🚨 Alerta: Ratio de retención crítico');
            }
        }
    }, [metricas, cargandoMetricas, añoSeleccionado, mesSeleccionado, meses]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header con filtros */}
                    <HeaderConFiltros
                        configuracion={configuracion}
                        añoSeleccionado={añoSeleccionado}
                        setAñoSeleccionado={setAñoSeleccionado}
                        mesSeleccionado={mesSeleccionado}
                        setMesSeleccionado={setMesSeleccionado}
                        añosCompletos={añosCompletos}
                        meses={meses}
                    />

                    {/* Métricas principales */}
                    <MetricasPrincipales
                        metricas={metricas}
                        cargandoMetricas={cargandoMetricas}
                        animacionActiva={animacionActiva}
                        mesSeleccionado={mesSeleccionado}
                        añoSeleccionado={añoSeleccionado}
                        meses={meses}
                    />

                    {/* Métricas secundarias */}
                    <MetricasSecundarias
                        metricas={metricas}
                        empleados={empleados}
                    />

                    {/* Sección departamentos */}
                    <SeccionDepartamentos
                        departamentos={departamentos}
                        deptoMayorEmpleados={deptoMayorEmpleados}
                        empleados={empleados}
                        totalEmpleados={metricas.totalEmpleados}
                    />
                </div>
            </div>
        </div>
    );
}


//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="py-8">
//                 <div className="max-w-7xl mx-auto px-4">
//                     {/* Header con filtros */}
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
//                         <div>
//                             <h1 className="text-3xl font-bold text-gray-900">
//                                 🎯 {configuracion.empresa}
//                             </h1>
//                             <p className="text-gray-600 mt-1">
//                                 Dashboard de Recursos Humanos - v{configuracion.version}
//                             </p>
//                         </div>

//                         <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-0">
//                             {/* Select de Año */}
//                             <select
//                                 value={añoSeleccionado}
//                                 onChange={(e) => setAñoSeleccionado(parseInt(e.target.value))}
//                                 className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
//                                 style={{
//                                     backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
//                                     backgroundPosition: 'right 0.5rem center',
//                                     backgroundRepeat: 'no-repeat',
//                                     backgroundSize: '1.5em 1.5em'
//                                 }}
//                             >
//                                 {añosCompletos.map(año => (
//                                     <option key={año} value={año}>
//                                         📅 {año}
//                                     </option>
//                                 ))}
//                             </select>

//                             {/* Select de Mes */}
//                             <select
//                                 value={mesSeleccionado}
//                                 onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
//                                 className="px-4 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer"
//                                 style={{
//                                     backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
//                                     backgroundPosition: 'right 0.5rem center',
//                                     backgroundRepeat: 'no-repeat',
//                                     backgroundSize: '1.5em 1.5em'
//                                 }}
//                             >
//                                 {meses.map(mes => (
//                                     <option key={mes.valor} value={mes.valor}>
//                                         {mes.nombre}
//                                     </option>
//                                 ))}
//                             </select>

//                             <Link
//                                 href="/empleados"
//                                 className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
//                             >
//                                 👥 Gestionar Empleados
//                             </Link>
//                         </div>
//                     </div>

//                     {/* Grid principal de métricas */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                         <MetricCard
//                             titulo="Total Empleados"
//                             valor={cargandoMetricas ? "..." : totalEmpleados}
//                             color="blue"
//                             subtitulo="En toda la empresa"
//                             animacion={animacionActiva}
//                         />
//                         <MetricCard
//                             titulo="Empleados Activos"
//                             valor={cargandoMetricas ? "..." : empleadosActivosTotal}
//                             color="green"
//                             subtitulo={cargandoMetricas ? "Calculando..." : `${ratioRetencion.toFixed(1)}% retencion`}
//                             animacion={animacionActiva}
//                         />
//                         <MetricCard
//                             titulo={`Contratados en ${meses.find(m => m.valor === mesSeleccionado)?.nombre}`}
//                             valor={cargandoMetricas ? "..." : empleadosContratadosMes}
//                             color={empleadosContratadosMes > 0 ? "blue" : "gray"}
//                             subtitulo={`${añoSeleccionado}`}
//                             animacion={animacionActiva}
//                         />
//                         <MetricCard
//                             titulo="Promedio Salarial"
//                             valor={cargandoMetricas ? "..." : `€${Math.round(promedioSalarial).toLocaleString()}`}
//                             color="yellow"
//                             subtitulo="Salario medio"
//                             animacion={animacionActiva}
//                         />
//                     </div>

//                     {/* Segunda fila de métricas profesionales */}
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//                         <MetricCard
//                             titulo="Empleados Inactivos"
//                             valor={empleadosInactivosTotal}
//                             color="red"
//                             subtitulo="Requieren atencion"
//                         />
//                         <MetricCard
//                             titulo="Antigüedad Media"
//                             valor={`${promedioAntiguedad.toFixed(1)} años`}
//                             color="purple"
//                             subtitulo="Experiencia promedio"
//                         />
//                         <MetricCard
//                             titulo="Distribucion Salarial"
//                             valor={`€${Math.round(Math.min(...empleados.map(e => e.salario))).toLocaleString()}-${Math.round(Math.max(...empleados.map(e => e.salario))).toLocaleString()}`}
//                             color="green"
//                             subtitulo="Rango salarial"
//                         />
//                         <MetricCard
//                             titulo="Ratio Retencion"
//                             valor={`${ratioRetencion.toFixed(1)}%`}
//                             color={ratioRetencion >= 85 ? "green" : ratioRetencion >= 70 ? "yellow" : "red"}
//                             subtitulo={ratioRetencion >= 85 ? "Excelente" : ratioRetencion >= 70 ? "Bueno" : "Crítico"}
//                         />
//                     </div>

//                     {/* Seccion departamentos */}
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                         {/* Distribucion por departamentos */}
//                         <div className="bg-white rounded-lg shadow p-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                                 📊 Distribucion por Departamentos
//                             </h2>
//                             <div className="space-y-3">
//                                 {Object.entries(departamentos).map(([depto, count]) => (
//                                     <div key={depto} className="flex items-center justify-between">
//                                         <span className="text-gray-700">{depto}</span>
//                                         <div className="flex items-center">
//                                             <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
//                                                 <div
//                                                     className="bg-blue-500 h-2 rounded-full"
//                                                     style={{ width: `${(count / totalEmpleados) * 100}%` }}
//                                                 ></div>
//                                             </div>
//                                             <span className="font-semibold text-gray-900 w-8 text-right">
//                                                 {count}
//                                             </span>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>

//                             {deptoMayorEmpleados && (
//                                 <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                                     <p className="text-sm text-blue-700">
//                                         🏆 <strong>{deptoMayorEmpleados[0]}</strong> es el departamento con más empleados ({deptoMayorEmpleados[1]})
//                                     </p>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Empleados recientes */}
//                         <div className="bg-white rounded-lg shadow p-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                                 👋 Empleados Activos Recientes
//                             </h2>
//                             <div className="space-y-3">
//                                 {empleados
//                                     .filter(emp => emp.activo)
//                                     .slice(0, 4)
//                                     .map(empleado => (
//                                         <div key={empleado.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
//                                             <div className="w-2 h-2 bg-green-400 rounded-full"></div>
//                                             <div className="flex-1">
//                                                 <p className="font-medium text-gray-900">{empleado.nombre}</p>
//                                                 <p className="text-sm text-gray-500">{empleado.departamento}</p>
//                                             </div>
//                                             <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
//                                                 Activo
//                                             </span>
//                                         </div>
//                                     ))}
//                             </div>

//                             <Link
//                                 href="/empleados"
//                                 className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium"
//                             >
//                                 Ver todos los empleados →
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }