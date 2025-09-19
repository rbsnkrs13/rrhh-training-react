import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Definir el tipo para la función route
interface RouteFunctionType {
    (name?: string, params?: any, absolute?: boolean): string;
    current(): string | undefined;
    current(name: string, params?: any): boolean;
    has(name: string): boolean;
    params(): { [key: string]: any };
}

// Mock de route helper global para tests
const routeMock = vi.fn((name?: string) => {
    if (name === 'dashboard') return '/dashboard';
    if (name === 'empleados.index') return '/empleados';
    if (name === 'empleados.create') return '/empleados/create';
    if (name === 'empleados.edit') return '/empleados/1/edit';
    if (name === 'profile.edit') return '/profile';
    if (name === 'logout') return '/logout';
    return `/${name || ''}`;
}) as any;

// Añadir propiedades adicionales al mock
routeMock.current = vi.fn((name?: string) => {
    if (name) return window.location.pathname.includes(name);
    return window.location.pathname;
});
routeMock.has = vi.fn(() => true);
routeMock.params = vi.fn(() => ({}));

global.route = routeMock as RouteFunctionType;

// Mock de window.matchMedia para tests
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});