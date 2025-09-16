import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useDepartamentos from '@/Hooks/useDepartamentos';
import type { Empleado } from '@/types';

describe('useDepartamentos', () => {
    const mockEmpleados: Empleado[] = [
        {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@test.com',
            departamento: 'IT',
            puesto: 'Developer',
            salario: 50000,
            fecha_contratacion: '2023-01-15',
            activo: true,
            notas: null,
        },
        {
            id: 2,
            nombre: 'María García',
            email: 'maria@test.com',
            departamento: 'IT',
            puesto: 'Senior Developer',
            salario: 60000,
            fecha_contratacion: '2022-06-01',
            activo: true,
            notas: null,
        },
        {
            id: 3,
            nombre: 'Carlos López',
            email: 'carlos@test.com',
            departamento: 'RRHH',
            puesto: 'HR Manager',
            salario: 45000,
            fecha_contratacion: '2021-03-10',
            activo: true,
            notas: null,
        },
        {
            id: 4,
            nombre: 'Ana Rodríguez',
            email: 'ana@test.com',
            departamento: 'Ventas',
            puesto: 'Sales Rep',
            salario: 40000,
            fecha_contratacion: '2023-08-01',
            activo: true,
            notas: null,
        },
    ];

    it('debe contar empleados por departamento correctamente', () => {
        const { result } = renderHook(() => useDepartamentos(mockEmpleados));

        const { departamentos } = result.current;

        expect(departamentos.IT).toBe(2);
        expect(departamentos.RRHH).toBe(1);
        expect(departamentos.Ventas).toBe(1);
    });

    it('debe identificar el departamento con más empleados', () => {
        const { result } = renderHook(() => useDepartamentos(mockEmpleados));

        const { deptoMayorEmpleados } = result.current;

        expect(deptoMayorEmpleados[0]).toBe('IT');
        expect(deptoMayorEmpleados[1]).toBe(2);
    });

    it('debe manejar lista vacía de empleados', () => {
        const { result } = renderHook(() => useDepartamentos([]));

        const { departamentos, deptoMayorEmpleados } = result.current;

        expect(departamentos).toEqual({});
        expect(deptoMayorEmpleados).toEqual(['', 0]);
    });

    it('debe manejar un solo empleado', () => {
        const singleEmployee = [mockEmpleados[0]];
        const { result } = renderHook(() => useDepartamentos(singleEmployee));

        const { departamentos, deptoMayorEmpleados } = result.current;

        expect(departamentos.IT).toBe(1);
        expect(deptoMayorEmpleados[0]).toBe('IT');
        expect(deptoMayorEmpleados[1]).toBe(1);
    });

    it('debe actualizar cuando cambian los empleados', () => {
        const { result, rerender } = renderHook(
            ({ empleados }) => useDepartamentos(empleados),
            { initialProps: { empleados: mockEmpleados.slice(0, 2) } }
        );

        // Estado inicial - solo 2 empleados de IT
        expect(result.current.departamentos.IT).toBe(2);
        expect(result.current.departamentos.RRHH).toBeUndefined();

        // Actualizar con todos los empleados
        rerender({ empleados: mockEmpleados });

        expect(result.current.departamentos.IT).toBe(2);
        expect(result.current.departamentos.RRHH).toBe(1);
        expect(result.current.departamentos.Ventas).toBe(1);
    });

    it('debe memoizar resultados con los mismos empleados', () => {
        const { result, rerender } = renderHook(
            ({ empleados }) => useDepartamentos(empleados),
            { initialProps: { empleados: mockEmpleados } }
        );

        const firstResult = result.current;

        // Re-renderizar con la misma referencia
        rerender({ empleados: mockEmpleados });

        // Debería ser la misma referencia (memoizada)
        expect(result.current).toBe(firstResult);
    });
});