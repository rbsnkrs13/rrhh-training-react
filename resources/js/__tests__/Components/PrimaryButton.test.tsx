import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';

describe('PrimaryButton', () => {
    it('debe renderizar children correctamente', () => {
        render(<PrimaryButton>Guardar</PrimaryButton>);

        expect(screen.getByRole('button', { name: 'Guardar' })).toBeInTheDocument();
    });

    it('debe aplicar className personalizada', () => {
        render(<PrimaryButton className="custom-class">Test</PrimaryButton>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    it('debe estar deshabilitado cuando disabled es true', () => {
        render(<PrimaryButton disabled>Disabled Button</PrimaryButton>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('opacity-25');
    });

    it('debe aplicar estilos de disabled cuando está deshabilitado', () => {
        render(<PrimaryButton disabled>Test</PrimaryButton>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('opacity-25');
    });

    it('debe ejecutar onClick cuando se hace clic', () => {
        const handleClick = vi.fn();
        render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('no debe ejecutar onClick cuando está deshabilitado', () => {
        const handleClick = vi.fn();
        render(
            <PrimaryButton disabled onClick={handleClick}>
                Disabled
            </PrimaryButton>
        );

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(handleClick).not.toHaveBeenCalled();
    });

    it('debe aplicar todos los props HTML del button', () => {
        render(
            <PrimaryButton type="submit" data-testid="submit-button">
                Submit
            </PrimaryButton>
        );

        const button = screen.getByTestId('submit-button');
        expect(button).toHaveAttribute('type', 'submit');
    });

    it('debe tener clases base por defecto', () => {
        render(<PrimaryButton>Test</PrimaryButton>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass(
            'inline-flex',
            'items-center',
            'px-4',
            'py-2',
            'bg-gray-800',
            'border',
            'border-transparent',
            'rounded-md',
            'font-semibold',
            'text-xs',
            'text-white',
            'uppercase',
            'tracking-widest'
        );
    });

    it('debe combinar className personalizada con clases base', () => {
        render(<PrimaryButton className="mt-4">Test</PrimaryButton>);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('mt-4');
        expect(button).toHaveClass('bg-gray-800'); // Clase base
    });

    it('debe ser accesible con foco del teclado', () => {
        render(<PrimaryButton>Focusable</PrimaryButton>);

        const button = screen.getByRole('button');
        button.focus();

        expect(button).toHaveFocus();
    });
});