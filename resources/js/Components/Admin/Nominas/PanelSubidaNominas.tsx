import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';

interface Empleado {
    id: number;
    name: string;
    dni: string;
}

interface ArchivoPreview {
    file: File;
    dni?: string;
    empleado?: string;
    error?: string;
    status: 'pending' | 'valid' | 'error';
}

interface PanelSubidaNominasProps {
    empleados: Empleado[];
    añosDisponibles: number[];
}

export default function PanelSubidaNominas({ empleados, añosDisponibles }: PanelSubidaNominasProps) {
    const [archivosPreview, setArchivosPreview] = useState<ArchivoPreview[]>([]);
    const [periodoAño, setPeriodoAño] = useState(new Date().getFullYear());
    const [periodoMes, setPeriodoMes] = useState(new Date().getMonth() + 1);
    const [isDragging, setIsDragging] = useState(false);
    const [procesando, setProcesando] = useState(false);

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
                setProcesando(false);
            },
            onError: () => {
                setProcesando(false);
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

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
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
    );
}
