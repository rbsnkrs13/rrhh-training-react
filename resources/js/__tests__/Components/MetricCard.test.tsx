import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MetricCard from '@/Components/Dashboard/MetricCard';

describe('MetricCard', () => {
    const defaultProps = {
        titulo: 'Total Empleados',
        valor: 150,
    };

    it('debe renderizar título y valor correctamente', () => {
        render(<MetricCard {...defaultProps} />);

        expect(screen.getByText('Total Empleados')).toBeInTheDocument();
        expect(screen.getByText('150')).toBeInTheDocument();
    });

    it('debe renderizar descripción cuando se proporciona', () => {
        render(
            <MetricCard
                {...defaultProps}
                descripcion="Total de empleados en la empresa"
            />
        );

        expect(screen.getByText('Total de empleados en la empresa')).toBeInTheDocument();
    });

    it('debe renderizar subtítulo cuando se proporciona', () => {
        render(<MetricCard {...defaultProps} subtitulo="Activos" />);

        expect(screen.getByText('Activos')).toBeInTheDocument();
    });

    it('debe aplicar clase de color correcta', () => {
        const { container } = render(<MetricCard {...defaultProps} color="green" />);

        const cardElement = container.querySelector('.bg-green-50');
        expect(cardElement).toBeInTheDocument();
    });

    it('debe mostrar valor como string', () => {
        render(<MetricCard {...defaultProps} valor="€45,000" />);

        expect(screen.getByText('€45,000')).toBeInTheDocument();
    });

    it('debe aplicar animación cuando está cargando', () => {
        const { container } = render(<MetricCard {...defaultProps} cargando={true} />);

        const cardElement = container.querySelector('.animate-pulse');
        expect(cardElement).toBeInTheDocument();
    });

    it('debe aplicar animación cuando animacion es true', () => {
        const { container } = render(
            <MetricCard {...defaultProps} animacion={true} />
        );

        const cardElement = container.querySelector('.animate-pulse');
        expect(cardElement).toBeInTheDocument();
    });

    it('debe aplicar color blue por defecto', () => {
        const { container } = render(<MetricCard {...defaultProps} />);

        const cardElement = container.querySelector('.bg-blue-50');
        expect(cardElement).toBeInTheDocument();
    });

    it('debe aplicar todas las variantes de color correctamente', () => {
        const colors = ['blue', 'green', 'yellow', 'red', 'purple', 'gray'] as const;

        colors.forEach(color => {
            const { container } = render(<MetricCard {...defaultProps} color={color} />);
            const cardElement = container.querySelector(`.bg-${color}-50`);
            expect(cardElement).toBeInTheDocument();
        });
    });

    it('debe renderizar título, valor y descripción juntos', () => {
        render(
            <MetricCard
                titulo="Ratio Retención"
                valor="85.5%"
                color="green"
                descripcion="Porcentaje de empleados que permanecen"
                cargando={false}
                animacion={false}
            />
        );

        expect(screen.getByText('Ratio Retención')).toBeInTheDocument();
        expect(screen.getByText('85.5%')).toBeInTheDocument();
        expect(screen.getByText('Porcentaje de empleados que permanecen')).toBeInTheDocument();
    });

    it('debe mostrar valor normal cuando no está cargando', () => {
        render(<MetricCard {...defaultProps} cargando={false} />);

        expect(screen.getByText('150')).toBeInTheDocument();
    });
});