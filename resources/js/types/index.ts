// Interfaces principales del sistema RRHH

export interface Empleado {
    id: number;
    nombre: string;
    email: string;
    departamento: 'IT' | 'RRHH' | 'Ventas' | 'Marketing' | 'Contabilidad' | 'Logística';
    puesto: string | null;
    salario: number | null;
    fecha_contratacion: string;
    activo: boolean;
    notas: string | null;
    antiguedad?: number;
}

export interface Metricas {
    empleadosContratadosMes: number;
    empleadosActivosTotal: number;
    empleadosInactivosTotal: number;
    totalEmpleados: number;
    promedioAntiguedad: number;
    promedioSalarial: number;
    ratioRetencion: number;
    rangoSalarial: { min: number; max: number };
}

// Ya no se usa - mantener para futura funcionalidad
export interface Departamento {
    nombre: string;
    cantidad: number;
    porcentaje: number;
}

export interface Filtros {
    busqueda: string;
    departamento: string;
    estado: string;
    ordenPor: string;
}

export interface Mes {
    valor: number;
    nombre: string;
}

export interface FlashMessage {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface PageProps {
    flash?: FlashMessage;
    auth?: {
        user: User;
    };
    [key: string]: any;
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface ConfiguracionDashboard {
    titulo: string;
    descripcion: string;
    empresa?: string;
    version?: string;
}

// Props de componentes principales
export interface DashboardProps {
    empleadosIniciales: Empleado[];
    configuracion: ConfiguracionDashboard;
}

export interface EmpleadosProps {
    empleados: Empleado[];
    filtros?: Partial<Filtros>;
}

export interface MetricCardProps {
    titulo: string;
    valor: string | number;
    color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
    descripcion?: string;
    subtitulo?: string;
    cargando?: boolean;
    animacion?: boolean;
}

// Hook returns
export interface UseMetricasReturn {
    metricas: Metricas;
    cargandoMetricas: boolean;
    simularCarga: () => (() => void) | undefined;
}

export interface UseDepartamentosReturn {
    departamentos: Record<string, number>;
    deptoMayorEmpleados: [string, number];
}

export interface UsePeriodosReturn {
    añoSeleccionado: number;
    mesSeleccionado: number;
    setAñoSeleccionado: (año: number) => void;
    setMesSeleccionado: (mes: number) => void;
    meses: Mes[];
    añosCompletos: number[];
}

// Ziggy route helper types
declare global {
    var route: {
        (name?: string, params?: any, absolute?: boolean): string;
        current(): string | undefined;
        current(name: string, params?: any): boolean;
        has(name: string): boolean;
        params(): { [key: string]: any };
    };

    // Laravel Echo types
    interface Window {
        Echo: any;
        Pusher: any;
        axios: any;
    }
}

// Tipos para layouts y páginas
export interface AuthenticatedLayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    hideChat?: boolean;
}

export interface GuestLayoutProps {
    children: React.ReactNode;
}

// Tipos específicos para páginas Auth
export interface AuthPageProps extends PageProps {
    status?: string;
    canResetPassword?: boolean;
}

export interface ProfilePageProps extends PageProps {
    mustVerifyEmail?: boolean;
    status?: string;
}

export interface WelcomePageProps extends PageProps {
    laravelVersion: string;
    phpVersion: string;
}
