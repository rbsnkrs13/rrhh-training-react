import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';

// Mock de usePage
const mockUsePage = vi.fn();
vi.mock('@inertiajs/react', () => ({
    usePage: () => mockUsePage(),
}));

describe('FlashMessage', () => {
    beforeEach(() => {
        // Reset del mock antes de cada test
        mockUsePage.mockReturnValue({
            props: {
                flash: null,
            },
        });
    });

    it('no debe renderizar nada cuando no hay flash messages', () => {
        const { container } = render(<FlashMessage />);
        expect(container.firstChild).toBeNull();
    });

    it('debe ser un componente válido de React', () => {
        // Test básico para verificar que el componente se puede renderizar
        const component = render(<FlashMessage />);
        expect(component).toBeDefined();
    });

    it('debe renderizar sin errores con props válidos', () => {
        mockUsePage.mockReturnValue({
            props: {
                flash: { success: 'Test message' },
            },
        });

        const { container } = render(<FlashMessage />);
        expect(container).toBeDefined();
    });
});