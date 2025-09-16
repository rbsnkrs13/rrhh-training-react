import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import usePeriodos from '@/Hooks/usePeriodos';
import type { Empleado } from '@/types';

describe('usePeriodos', () => {
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
            departamento: 'RRHH',
            puesto: 'HR Manager',
            salario: 45000,
            fecha_contratacion: '2022-06-01',
            activo: true,
            notas: null,
        },
        {
            id: 3,
            nombre: 'Carlos López',
            email: 'carlos@test.com',
            departamento: 'IT',
            puesto: 'Senior Developer',
            salario: 60000,
            fecha_contratacion: '2021-03-10',
            activo: false,
            notas: null,
        },
    ];

    beforeEach(() => {
        // Mock de la fecha actual para tests consistentes (2024)
        vi.setSystemTime(new Date('2024-03-15'));
    });

    it('debe inicializar con año y mes actuales', () => {
        const { result } = renderHook(() => usePeriodos(mockEmpleados));

        expect(result.current.añoSeleccionado).toBe(2024);
        expect(result.current.mesSeleccionado).toBe(3); // Marzo
    });

    it('debe proporcionar lista completa de meses', () => {
        const { result } = renderHook(() => usePeriodos(mockEmpleados));

        const { meses } = result.current;

        expect(meses).toHaveLength(12);
        expect(meses[0]).toEqual({ valor: 1, nombre: 'Enero' });
        expect(meses[11]).toEqual({ valor: 12, nombre: 'Diciembre' });
    });

    it('debe generar años disponibles basado en empleados', () => {
        const { result } = renderHook(() => usePeriodos(mockEmpleados));

        const { añosCompletos } = result.current;

        // Debería incluir 2021, 2022, 2023, 2024, 2025 (año siguiente al actual)
        expect(añosCompletos).toContain(2021);
        expect(añosCompletos).toContain(2022);
        expect(añosCompletos).toContain(2023);
        expect(añosCompletos).toContain(2024);
        expect(añosCompletos.length).toBeGreaterThanOrEqual(4);
    });

    it('debe cambiar año seleccionado', () => {
        const { result } = renderHook(() => usePeriodos(mockEmpleados));

        act(() => {
            result.current.setAñoSeleccionado(2023);
        });

        expect(result.current.añoSeleccionado).toBe(2023);
    });

    it('debe cambiar mes seleccionado', () => {
        const { result } = renderHook(() => usePeriodos(mockEmpleados));

        act(() => {
            result.current.setMesSeleccionado(6);
        });

        expect(result.current.mesSeleccionado).toBe(6);
    });

    it('debe manejar lista vacía de empleados', () => {
        const { result } = renderHook(() => usePeriodos([]));

        const { añosCompletos } = result.current;

        // Debería incluir al menos el año actual y siguiente
        expect(añosCompletos).toContain(2024);
        expect(añosCompletos.length).toBeGreaterThanOrEqual(1);
    });

    it('debe actualizar años cuando cambian empleados', () => {
        const { result, rerender } = renderHook(
            ({ empleados }) => usePeriodos(empleados),
            { initialProps: { empleados: mockEmpleados.slice(0, 1) } }
        );

        // Inicialmente incluye al menos 2023 y 2024
        expect(result.current.añosCompletos).toContain(2023);
        expect(result.current.añosCompletos).toContain(2024);

        // Actualizar con todos los empleados
        rerender({ empleados: mockEmpleados });

        // Ahora debería incluir todos los años de empleados
        expect(result.current.añosCompletos).toContain(2021);
        expect(result.current.añosCompletos).toContain(2022);
        expect(result.current.añosCompletos).toContain(2023);
        expect(result.current.añosCompletos).toContain(2024);
    });

    it('debe mantener selecciones válidas al cambiar empleados', () => {
        const { result, rerender } = renderHook(
            ({ empleados }) => usePeriodos(empleados),
            { initialProps: { empleados: mockEmpleados } }
        );

        // Cambiar a año que existirá en nueva lista
        act(() => {
            result.current.setAñoSeleccionado(2023);
            result.current.setMesSeleccionado(6);
        });

        // Cambiar empleados
        rerender({ empleados: mockEmpleados.slice(0, 1) });

        // Las selecciones deberían mantenerse
        expect(result.current.añoSeleccionado).toBe(2023);
        expect(result.current.mesSeleccionado).toBe(6);
    });

    it('debe proporcionar funciones de cambio como callbacks estables', () => {
        const { result, rerender } = renderHook(() => usePeriodos(mockEmpleados));

        const setAñoRef = result.current.setAñoSeleccionado;
        const setMesRef = result.current.setMesSeleccionado;

        rerender();

        // Las referencias deberían ser las mismas (useCallback)
        expect(result.current.setAñoSeleccionado).toBe(setAñoRef);
        expect(result.current.setMesSeleccionado).toBe(setMesRef);
    });
});