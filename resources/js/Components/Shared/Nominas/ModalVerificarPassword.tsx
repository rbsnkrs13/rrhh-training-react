import { FormEventHandler, useState } from 'react';
import { Lock, X } from 'lucide-react';
import axios from 'axios';
import Modal from '@/Components/Shared/Common/Modal';
import PrimaryButton from '@/Components/Shared/Common/PrimaryButton';
import SecondaryButton from '@/Components/Shared/Common/SecondaryButton';
import TextInput from '@/Components/Shared/Common/TextInput';
import InputError from '@/Components/Shared/Common/InputError';

interface ModalVerificarPasswordProps {
    show: boolean;
    onClose: () => void;
    onVerificado: () => void;
}

export default function ModalVerificarPassword({
    show,
    onClose,
    onVerificado,
}: ModalVerificarPasswordProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [processing, setProcessing] = useState(false);

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setError('');
        setProcessing(true);

        try {
            const response = await axios.post('/mis-nominas/verificar-password', {
                password,
            });

            if (response.data.success) {
                setPassword('');
                onVerificado();
                onClose();
            } else {
                setError(response.data.message || 'Error al verificar la contraseña.');
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Error de conexión. Por favor, inténtalo de nuevo.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <Modal show={show} onClose={handleClose}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Lock className="w-6 h-6 text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Verificar Contraseña
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <p className="text-sm text-gray-600 mb-6">
                    Por seguridad, debes verificar tu contraseña para descargar nóminas.
                    La verificación será válida durante 2 minutos.
                    <span className="block mt-2 text-xs text-gray-500">
                        (Desarrollo: usa <strong>empleado123</strong>)
                    </span>
                </p>

                <form onSubmit={submit}>
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Contraseña
                        </label>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={password}
                            className="mt-1 block w-full"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            autoFocus
                        />
                        <InputError message={error} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-3">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Verificando...' : 'Verificar'}
                        </PrimaryButton>
                        <SecondaryButton type="button" onClick={handleClose}>
                            Cancelar
                        </SecondaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
