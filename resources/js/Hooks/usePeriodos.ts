import { useState, useMemo } from 'react';
import type { Empleado, Mes, UsePeriodosReturn } from '@/types';

// Hook personalizado para manejar selección de períodos (año y mes)
//Recibe empleados para calcular años disponibles y exportar funciones y estados
export default function usePeriodos(empleados: Empleado[]): UsePeriodosReturn {
    // Estados para año y mes seleccionados, inicializados al año y mes actual
    const [añoSeleccionado, setAñoSeleccionado] = useState<number>(new Date().getFullYear());
    const [mesSeleccionado, setMesSeleccionado] = useState<number>(new Date().getMonth() + 1);

    // Lista fija de meses para el selector
    const meses: Mes[] = [
        { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
        { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
        { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
        { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
        { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
        { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
    ];

    // useMemo para calcular años completos disponibles en los datos de empleados, evitando recálculos innecesarios ya que empleados no cambia
    const añosCompletos = useMemo<number[]>(() => {
        // Extrae años únicos de las fechas de contratación de los empleados
        const añosDisponibles = [...new Set(empleados.map(emp =>
            new Date(emp.fecha_contratacion).getFullYear()
        ))].sort((a, b) => b - a);

        // Asegura que el año actual y el siguiente siempre estén incluidos
        return [...new Set([
            ...añosDisponibles,
            new Date().getFullYear(),
            new Date().getFullYear() + 1
        ])].sort((a, b) => b - a);
    }, [empleados]);

    //Devuelve estados y funciones para poder manejarlos en dashboard y header de filtros
    return {
        añoSeleccionado,
        mesSeleccionado,
        setAñoSeleccionado,
        setMesSeleccionado,
        meses,
        añosCompletos
    };
}