import { useState } from 'react';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Shared/Common/Modal';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';

interface Nomina {
    id: number;
    empleado: {
        name: string;
        dni: string;
    };
    año: number;
    mes: number;
    nombre_mes: string;
    salario_bruto?: number;
    salario_neto?: number;
    deducciones_ss?: number;
    deducciones_irpf?: number;
    observaciones?: string;
    estado: string;
}

interface ModalEdicionNominaProps {
    nomina: Nomina | null;
    onClose: () => void;
}

export default function ModalEdicionNomina({ nomina, onClose }: ModalEdicionNominaProps) {
    const [datosEdicion, setDatosEdicion] = useState({
        salario_bruto: nomina?.salario_bruto?.toString() || '',
        salario_neto: nomina?.salario_neto?.toString() || '',
        deducciones_ss: nomina?.deducciones_ss?.toString() || '',
        deducciones_irpf: nomina?.deducciones_irpf?.toString() || '',
        observaciones: nomina?.observaciones || ''
    });

    const actualizarNomina = () => {
        if (!nomina) return;

        router.put(route('admin.nominas.actualizar', nomina.id), datosEdicion, {
            onSuccess: () => {
                onClose();
            }
        });
    };

    return (
        <Modal show={nomina !== null} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                    Editar Nómina - {nomina?.empleado.name}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                    Período: {nomina?.nombre_mes} {nomina?.año}
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

                    {nomina?.estado === 'pendiente_completar' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                            <p className="text-sm text-yellow-800">
                                ℹ️ Esta nómina está marcada como "pendiente de completar" porque no se pudieron extraer
                                los datos automáticamente del PDF.
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-2">
                    <SecondaryButton onClick={onClose}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton onClick={actualizarNomina}>
                        Guardar Cambios
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
