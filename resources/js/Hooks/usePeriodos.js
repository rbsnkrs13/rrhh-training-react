import { useState, useMemo } from 'react';

export default  function usePeriodos(empleados) {
    const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear());
    const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);

    const meses = [
        { valor: 1, nombre: 'Enero' }, { valor: 2, nombre: 'Febrero' },
        { valor: 3, nombre: 'Marzo' }, { valor: 4, nombre: 'Abril' },
        { valor: 5, nombre: 'Mayo' }, { valor: 6, nombre: 'Junio' },
        { valor: 7, nombre: 'Julio' }, { valor: 8, nombre: 'Agosto' },
        { valor: 9, nombre: 'Septiembre' }, { valor: 10, nombre: 'Octubre' },
        { valor: 11, nombre: 'Noviembre' }, { valor: 12, nombre: 'Diciembre' }
    ];

    const añosCompletos = useMemo(() => {
        const añosDisponibles = [...new Set(empleados.map(emp =>
            new Date(emp.fecha_contratacion).getFullYear()
        ))].sort((a, b) => b - a);

        return [...new Set([
            ...añosDisponibles,
            new Date().getFullYear(),
            new Date().getFullYear() + 1
        ])].sort((a, b) => b - a);
    }, [empleados]);

    return {
        añoSeleccionado,
        mesSeleccionado,
        setAñoSeleccionado,
        setMesSeleccionado,
        meses,
        añosCompletos
    };
}