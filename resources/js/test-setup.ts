import '@testing-library/jest-dom';

// Mock de route helper global para tests
global.route = vi.fn((name?: string, params?: any, absolute?: boolean) => {
    if (name === 'dashboard') return '/dashboard';
    if (name === 'empleados.index') return '/empleados';
    if (name === 'empleados.create') return '/empleados/create';
    if (name === 'empleados.edit') return '/empleados/1/edit';
    if (name === 'profile.edit') return '/profile';
    if (name === 'logout') return '/logout';
    return `/${name || ''}`;
});

// Añadir propiedades adicionales al mock
Object.assign(global.route, {
    current: vi.fn((name?: string) => {
        if (name) return window.location.pathname.includes(name);
        return window.location.pathname;
    }),
    has: vi.fn(() => true),
    params: vi.fn(() => ({})),
});

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