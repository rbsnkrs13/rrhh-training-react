import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useCallback } from 'react';
import { Upload, FileText, Trash2, Download, AlertCircle, CheckCircle, X, Edit } from 'lucide-react';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';
import DangerButton from '@/Components/Shared/Common/DangerButton';
import Modal from '@/Components/Shared/Common/Modal';
import FlashMessage from '@/Components/Shared/Common/FlashMessage';

interface Empleado {
    id: number;
    name: string;
    dni: string;
}

interface Nomina {
    id: number;
    empleado_id: number;
    empleado: {
        name: string;
        dni: string;
    };
    año: number;
    mes: number;
    nombre_mes: string;
    archivo_nombre: string;
    archivo_tamaño: number;
    salario_bruto?: number;
    salario_neto?: number;
    deducciones_ss?: number;
    deducciones_irpf?: number;
    observaciones?: string;
    estado: string;
    created_at: string;
}

interface ArchivoPreview {
    file: File;
    dni?: string;
    empleado?: string;
    error?: string;
    status: 'pending' | 'valid' | 'error';
}

interface Props extends PageProps {
    nominas: Nomina[];
    empleados: Empleado[];
    año: number;
    mes?: number;
    añosDisponibles: number[];
    estadisticas: {
        total_nominas: number;
        total_empleados: number;
        salario_bruto_total: number;
        salario_neto_total: number;
    };
}

export default function Index({ auth, nominas, empleados, año, mes, añosDisponibles, estadisticas }: Props) {
    const [mostrarSubida, setMostrarSubida] = useState(false);
    const [archivosPreview, setArchivosPreview] = useState<ArchivoPreview[]>([]);
    const [periodoAño, setPeriodoAño] = useState(año);
    const [periodoMes, setPeriodoMes] = useState(mes || new Date().getMonth() + 1);
    const [isDragging, setIsDragging] = useState(false);
    const [procesando, setProcesando] = useState(false);
    const [nominaEditando, setNominaEditando] = useState<Nomina | null>(null);
    const [datosEdicion, setDatosEdicion] = useState({
        salario_bruto: '',
        salario_neto: '',
        deducciones_ss: '',
        deducciones_irpf: '',
        observaciones: ''
    });
    const [cardFlipped, setCardFlipped] = useState<{ [key: number]: boolean }>({});
    const [nominaExpandida, setNominaExpandida] = useState<number | null>(null);

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const extraerDNI = (filename: string): string | null => {
        const sinExtension = filename.replace(/\.pdf$/i, '');
        const match = sinExtension.match(/^(\d{8}[-]?[A-Za-z])/);
        return match ? match[1].toUpperCase().replace('-', '') : null;
    };

    const buscarEmpleadoPorDNI = (dni: string): Empleado | undefined => {
        return empleados.find(emp => emp.dni === dni);
    };

    const procesarArchivos = useCallback((files: FileList | File[]) => {
        const archivosArray = Array.from(files);
        const pdfs = archivosArray.filter(file => file.type === 'application/pdf');

        const previews: ArchivoPreview[] = pdfs.map(file => {
            const dni = extraerDNI(file.name);

            if (!dni) {
                return {
                    file,
                    status: 'error' as const,
                    error: 'No se pudo extraer DNI del nombre del archivo'
                };
            }

            const empleado = buscarEmpleadoPorDNI(dni);

            if (!empleado) {
                return {
                    file,
                    dni,
                    status: 'error' as const,
                    error: `No existe empleado con DNI: ${dni}`
                };
            }

            return {
                file,
                dni,
                empleado: empleado.name,
                status: 'valid' as const
            };
        });

        setArchivosPreview(previews);
    }, [empleados]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        procesarArchivos(e.dataTransfer.files);
    }, [procesarArchivos]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            procesarArchivos(e.target.files);
        }
    }, [procesarArchivos]);

    const eliminarArchivo = (index: number) => {
        setArchivosPreview(prev => prev.filter((_, i) => i !== index));
    };

    const subirArchivos = async () => {
        const archivosValidos = archivosPreview.filter(a => a.status === 'valid');

        if (archivosValidos.length === 0) {
            alert('No hay archivos válidos para subir');
            return;
        }

        setProcesando(true);

        const formData = new FormData();
        formData.append('año', periodoAño.toString());
        formData.append('mes', periodoMes.toString());

        archivosValidos.forEach((preview, index) => {
            formData.append(`archivos[${index}]`, preview.file);
        });

        router.post(route('admin.nominas.subir-masivo'), formData, {
            onSuccess: () => {
                setArchivosPreview([]);
                setMostrarSubida(false);
                setProcesando(false);
            },
            onError: () => {
                setProcesando(false);
            }
        });
    };

    const aplicarFiltros = (nuevoAño?: number, nuevoMes?: number, empleadoId?: number) => {
        const params: Record<string, string> = {};

        if (nuevoAño !== undefined) params.año = nuevoAño.toString();
        if (nuevoMes !== undefined) params.mes = nuevoMes.toString();
        if (empleadoId !== undefined) params.empleado_id = empleadoId.toString();

        router.get(route('admin.nominas.index'), params, { preserveState: true });
    };

    const eliminarNomina = (nominaId: number) => {
        if (confirm('¿Estás seguro de eliminar esta nómina? Esta acción no se puede deshacer.')) {
            router.delete(route('admin.nominas.eliminar', nominaId));
        }
    };

    const descargarNomina = (nominaId: number) => {
        window.open(route('user.nominas.descargar', nominaId), '_blank');
    };

    const abrirModalEdicion = (nomina: Nomina) => {
        setNominaEditando(nomina);
        setDatosEdicion({
            salario_bruto: nomina.salario_bruto?.toString() || '',
            salario_neto: nomina.salario_neto?.toString() || '',
            deducciones_ss: nomina.deducciones_ss?.toString() || '',
            deducciones_irpf: nomina.deducciones_irpf?.toString() || '',
            observaciones: nomina.observaciones || ''
        });
    };

    const cerrarModalEdicion = () => {
        setNominaEditando(null);
        setDatosEdicion({
            salario_bruto: '',
            salario_neto: '',
            deducciones_ss: '',
            deducciones_irpf: '',
            observaciones: ''
        });
    };

    const actualizarNomina = () => {
        if (!nominaEditando) return;

        router.put(route('admin.nominas.actualizar', nominaEditando.id), datosEdicion, {
            onSuccess: () => {
                cerrarModalEdicion();
            }
        });
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const toggleCard = (cardIndex: number) => {
        setCardFlipped(prev => ({ ...prev, [cardIndex]: !prev[cardIndex] }));
    };

    // Calcular promedios para las tarjetas volteadas
    const promedioNominas = estadisticas.total_nominas > 0 ? estadisticas.total_nominas / (mes ? 1 : 12) : 0;
    const promedioBruto = estadisticas.total_nominas > 0 ? estadisticas.salario_bruto_total / estadisticas.total_nominas : 0;
    const promedioNeto = estadisticas.total_nominas > 0 ? estadisticas.salario_neto_total / estadisticas.total_nominas : 0;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Nóminas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <FlashMessage />

                    {/* Header */}
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Nóminas</h1>
                        <div className="flex gap-3">
                            <SecondaryButton onClick={() => window.location.href = route('admin.nominas.ejemplo.descargar-todas')}>
                                <FileText className="w-4 h-4 mr-2" />
                                Generar Nóminas
                            </SecondaryButton>
                            <PrimaryButton onClick={() => setMostrarSubida(!mostrarSubida)}>
                                <Upload className="w-4 h-4 mr-2" />
                                {mostrarSubida ? 'Cerrar Subida' : 'Subir Nóminas'}
                            </PrimaryButton>
                        </div>
                    </div>

                    {/* Estadísticas con efecto Flip */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {/* Card 1: Total Nóminas */}
                        <div
                            className="relative h-32 cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => toggleCard(0)}
                        >
                            <div
                                className="absolute w-full h-full transition-all duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: cardFlipped[0] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute w-full h-full bg-white p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="text-sm text-gray-600">Total Nóminas</div>
                                    <div className="text-2xl font-bold text-gray-900">{estadisticas.total_nominas}</div>
                                </div>
                                <div className="absolute w-full h-full bg-indigo-600 p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="text-sm text-indigo-200">Promedio/Mes</div>
                                    <div className="text-2xl font-bold text-white">{promedioNominas.toFixed(1)}</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Empleados */}
                        <div
                            className="relative h-32 cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => toggleCard(1)}
                        >
                            <div
                                className="absolute w-full h-full transition-all duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: cardFlipped[1] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute w-full h-full bg-white p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="text-sm text-gray-600">Empleados con Nómina</div>
                                    <div className="text-2xl font-bold text-gray-900">{estadisticas.total_empleados}</div>
                                </div>
                                <div className="absolute w-full h-full bg-purple-600 p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="text-sm text-purple-200">Cobertura</div>
                                    <div className="text-2xl font-bold text-white">{((estadisticas.total_empleados / empleados.length) * 100).toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Total Bruto */}
                        <div
                            className="relative h-32 cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => toggleCard(2)}
                        >
                            <div
                                className="absolute w-full h-full transition-all duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: cardFlipped[2] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute w-full h-full bg-white p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="text-sm text-gray-600">Total Bruto</div>
                                    <div className="text-2xl font-bold text-green-600">
                                        {estadisticas.salario_bruto_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                    </div>
                                </div>
                                <div className="absolute w-full h-full bg-green-600 p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="text-sm text-green-200">Promedio/Empleado</div>
                                    <div className="text-2xl font-bold text-white">
                                        {promedioBruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: Total Neto */}
                        <div
                            className="relative h-32 cursor-pointer"
                            style={{ perspective: '1000px' }}
                            onClick={() => toggleCard(3)}
                        >
                            <div
                                className="absolute w-full h-full transition-all duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: cardFlipped[3] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                }}
                            >
                                <div className="absolute w-full h-full bg-white p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden' }}>
                                    <div className="text-sm text-gray-600">Total Neto</div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {estadisticas.salario_neto_total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                    </div>
                                </div>
                                <div className="absolute w-full h-full bg-blue-600 p-6 rounded-lg shadow" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                                    <div className="text-sm text-blue-200">Promedio/Empleado</div>
                                    <div className="text-2xl font-bold text-white">
                                        {promedioNeto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Panel de Subida */}
                    {mostrarSubida && (
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold mb-4">Subir Nóminas</h2>

                            {/* Selectores de Período */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                                    <select
                                        value={periodoAño}
                                        onChange={(e) => setPeriodoAño(parseInt(e.target.value))}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {añosDisponibles.map(a => (
                                            <option key={a} value={a}>{a}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                                    <select
                                        value={periodoMes}
                                        onChange={(e) => setPeriodoMes(parseInt(e.target.value))}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {meses.map((m, i) => (
                                            <option key={i} value={i + 1}>{m}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Zona de Drag & Drop */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                                    isDragging
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-300 bg-gray-50'
                                }`}
                            >
                                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-2">
                                    Arrastra archivos PDF aquí o{' '}
                                    <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
                                        selecciona archivos
                                        <input
                                            type="file"
                                            multiple
                                            accept=".pdf"
                                            onChange={handleFileInput}
                                            className="hidden"
                                        />
                                    </label>
                                </p>
                                <p className="text-sm text-gray-500">
                                    Formato: DNI_Nombre_Fecha.pdf (ej: 12345678A_Juan_202501.pdf)
                                </p>
                            </div>

                            {/* Preview de Archivos */}
                            {archivosPreview.length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">
                                        Archivos a subir ({archivosPreview.filter(a => a.status === 'valid').length} válidos)
                                    </h3>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {archivosPreview.map((preview, index) => (
                                            <div
                                                key={index}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                                    preview.status === 'valid'
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-red-50 border-red-200'
                                                }`}
                                            >
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <FileText className={`w-5 h-5 ${
                                                        preview.status === 'valid' ? 'text-green-600' : 'text-red-600'
                                                    }`} />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {preview.file.name}
                                                        </p>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                                                            <span>{formatBytes(preview.file.size)}</span>
                                                            {preview.dni && <span>• DNI: {preview.dni}</span>}
                                                            {preview.empleado && <span>• {preview.empleado}</span>}
                                                        </div>
                                                        {preview.error && (
                                                            <p className="text-xs text-red-600 mt-1">{preview.error}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {preview.status === 'valid' ? (
                                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                    <button
                                                        onClick={() => eliminarArchivo(index)}
                                                        className="text-gray-400 hover:text-red-600"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <SecondaryButton onClick={() => setArchivosPreview([])}>
                                            Limpiar
                                        </SecondaryButton>
                                        <PrimaryButton
                                            onClick={subirArchivos}
                                            disabled={procesando || archivosPreview.filter(a => a.status === 'valid').length === 0}
                                        >
                                            {procesando ? 'Subiendo...' : `Subir ${archivosPreview.filter(a => a.status === 'valid').length} Nóminas`}
                                        </PrimaryButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Filtros */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                                <select
                                    value={año}
                                    onChange={(e) => aplicarFiltros(parseInt(e.target.value), mes)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {añosDisponibles.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                                <select
                                    value={mes || ''}
                                    onChange={(e) => aplicarFiltros(año, e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Todos los meses</option>
                                    {meses.map((m, i) => (
                                        <option key={i} value={i + 1}>{m}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Empleado</label>
                                <select
                                    onChange={(e) => aplicarFiltros(año, mes, e.target.value ? parseInt(e.target.value) : undefined)}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Todos los empleados</option>
                                    {empleados.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.dni})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tabla Compacta de Nóminas con Expansión */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold">Nóminas Registradas</h2>
                            <p className="text-sm text-gray-500 mt-1">Haz clic en una fila para ver más detalles</p>
                        </div>
                        <div className="overflow-x-auto">
                            {nominas.length === 0 ? (
                                <div className="px-6 py-12 text-center text-gray-500">
                                    No hay nóminas registradas para los filtros seleccionados
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {nominas.map((nomina) => (
                                        <div key={nomina.id} className="hover:bg-gray-50 transition-colors">
                                            {/* Fila compacta */}
                                            <div
                                                className="px-6 py-4 cursor-pointer flex items-center justify-between group"
                                                onClick={() => setNominaExpandida(nominaExpandida === nomina.id ? null : nomina.id)}
                                            >
                                                <div className="flex items-center space-x-6 flex-1">
                                                    {/* Avatar */}
                                                    <div className="flex-shrink-0">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                            {nomina.empleado.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    </div>

                                                    {/* Info empleado */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {nomina.empleado.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{nomina.empleado.dni}</p>
                                                    </div>

                                                    {/* Período con badge */}
                                                    <div className="hidden sm:flex items-center space-x-2">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                                            {nomina.nombre_mes} {nomina.año}
                                                        </span>
                                                    </div>

                                                    {/* Salario con diseño mejorado */}
                                                    <div className="hidden md:block text-right">
                                                        <p className="text-lg font-bold text-green-600">
                                                            {nomina.salario_neto ? `${nomina.salario_neto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 font-medium">Salario Neto</p>
                                                    </div>

                                                    {/* Indicador expansión */}
                                                    <div className="flex-shrink-0">
                                                        <svg
                                                            className={`h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-all ${nominaExpandida === nomina.id ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sección expandida */}
                                            {nominaExpandida === nomina.id && (
                                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500 uppercase">Archivo</p>
                                                            <p className="text-sm text-gray-900 mt-1">{nomina.archivo_nombre}</p>
                                                            <p className="text-xs text-gray-500">{formatBytes(nomina.archivo_tamaño)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500 uppercase">Salario Bruto</p>
                                                            <p className="text-sm text-gray-900 mt-1">
                                                                {nomina.salario_bruto ? `${nomina.salario_bruto.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500 uppercase">Deducciones SS</p>
                                                            <p className="text-sm text-gray-900 mt-1">
                                                                {nomina.deducciones_ss ? `${nomina.deducciones_ss.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-medium text-gray-500 uppercase">Deducciones IRPF</p>
                                                            <p className="text-sm text-gray-900 mt-1">
                                                                {nomina.deducciones_irpf ? `${nomina.deducciones_irpf.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€` : '-'}
                                                            </p>
                                                        </div>
                                                        {nomina.observaciones && (
                                                            <div className="md:col-span-2">
                                                                <p className="text-xs font-medium text-gray-500 uppercase">Observaciones</p>
                                                                <p className="text-sm text-gray-900 mt-1">{nomina.observaciones}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Acciones */}
                                                    <div className="flex space-x-2 pt-4 border-t border-gray-200">
                                                        <SecondaryButton onClick={() => abrirModalEdicion(nomina)}>
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Editar
                                                        </SecondaryButton>
                                                        <SecondaryButton onClick={() => descargarNomina(nomina.id)}>
                                                            <Download className="w-4 h-4 mr-1" />
                                                            Descargar
                                                        </SecondaryButton>
                                                        <SecondaryButton
                                                            onClick={() => eliminarNomina(nomina.id)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Eliminar
                                                        </SecondaryButton>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal de Edición */}
                    <Modal show={nominaEditando !== null} onClose={cerrarModalEdicion}>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Editar Nómina - {nominaEditando?.empleado.name}
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Período: {nominaEditando?.nombre_mes} {nominaEditando?.año}
                            </p>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salario Bruto (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={datosEdicion.salario_bruto}
                                            onChange={(e) => setDatosEdicion({...datosEdicion, salario_bruto: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Salario Neto (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={datosEdicion.salario_neto}
                                            onChange={(e) => setDatosEdicion({...datosEdicion, salario_neto: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deducciones SS (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={datosEdicion.deducciones_ss}
                                            onChange={(e) => setDatosEdicion({...datosEdicion, deducciones_ss: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Deducciones IRPF (€)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={datosEdicion.deducciones_irpf}
                                            onChange={(e) => setDatosEdicion({...datosEdicion, deducciones_irpf: e.target.value})}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Observaciones
                                    </label>
                                    <textarea
                                        value={datosEdicion.observaciones}
                                        onChange={(e) => setDatosEdicion({...datosEdicion, observaciones: e.target.value})}
                                        rows={3}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        placeholder="Notas adicionales..."
                                    />
                                </div>

                                {nominaEditando?.estado === 'pendiente_completar' && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                                        <p className="text-sm text-yellow-800">
                                            ℹ️ Esta nómina está marcada como "pendiente de completar" porque no se pudieron extraer
                                            los datos automáticamente del PDF.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end space-x-2">
                                <SecondaryButton onClick={cerrarModalEdicion}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton onClick={actualizarNomina}>
                                    Guardar Cambios
                                </PrimaryButton>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
