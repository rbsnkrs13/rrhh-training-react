import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import useMetricas from '@/Hooks/useMetricas';
import type { Empleado } from '@/types';

describe('useMetricas', () => {
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
            notas: 'Empleado inactivo',
        },
    ];

    beforeEach(() => {
        // Mock de la fecha actual para tests consistentes
        vi.setSystemTime(new Date('2024-01-15'));
    });

    it('debe calcular métricas básicas correctamente', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        const { metricas } = result.current;

        expect(metricas.totalEmpleados).toBe(3);
        expect(metricas.empleadosActivosTotal).toBe(2);
        expect(metricas.empleadosInactivosTotal).toBe(1);
    });

    it('debe calcular promedio salarial correctamente', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        const { metricas } = result.current;
        const promedioEsperado = (50000 + 45000 + 60000) / 3;

        expect(metricas.promedioSalarial).toBe(promedioEsperado);
    });

    it('debe calcular rango salarial correctamente', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        const { metricas } = result.current;

        expect(metricas.rangoSalarial.min).toBe(45000);
        expect(metricas.rangoSalarial.max).toBe(60000);
    });

    it('debe calcular ratio de retención correctamente', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        const { metricas } = result.current;
        const ratioEsperado = (2 / 3) * 100; // 66.67%

        expect(metricas.ratioRetencion).toBeCloseTo(ratioEsperado, 2);
    });

    it('debe filtrar empleados por mes y año de contratación', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2023, 1, false)
        );

        const { metricas } = result.current;

        // Solo Juan Pérez fue contratado en enero 2023
        expect(metricas.empleadosContratadosMes).toBe(1);
    });

    it('debe manejar lista vacía de empleados', () => {
        const { result } = renderHook(() => useMetricas([], 2024, 1, false));

        const { metricas } = result.current;

        expect(metricas.totalEmpleados).toBe(0);
        expect(metricas.empleadosActivosTotal).toBe(0);
        expect(metricas.empleadosInactivosTotal).toBe(0);
        expect(metricas.promedioSalarial).toBeNaN(); // División por 0 = NaN
        expect(metricas.ratioRetencion).toBeNaN(); // División por 0 = NaN
        expect(metricas.rangoSalarial.min).toBe(0);
        expect(metricas.rangoSalarial.max).toBe(0);
    });

    it('debe mostrar estado de carga inicial como false', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        expect(result.current.cargandoMetricas).toBe(false);
    });

    it('debe proporcionar función simularCarga', () => {
        const { result } = renderHook(() =>
            useMetricas(mockEmpleados, 2024, 1, false)
        );

        expect(typeof result.current.simularCarga).toBe('function');
    });
});