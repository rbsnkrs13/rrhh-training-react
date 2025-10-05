import { Head, Link, useForm } from '@inertiajs/react';
import LoginHeader from '@/Components/Shared/Auth/LoginHeader';
import StatusMessage from '@/Components/Shared/Auth/StatusMessage';
import EmailInput from '@/Components/Shared/Auth/EmailInput';
import PasswordInput from '@/Components/Shared/Auth/PasswordInput';
import LoginButton from '@/Components/Shared/Auth/LoginButton';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
            <Head title="Iniciar Sesión - Sistema RRHH" />

            <div className="w-full max-w-md">
                <LoginHeader />

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <StatusMessage status={status} />

                    <form onSubmit={submit} className="space-y-6">
                        <EmailInput
                            value={data.email}
                            error={errors.email}
                            onChange={(value) => setData('email', value)}
                        />

                        <PasswordInput
                            value={data.password}
                            error={errors.password}
                            onChange={(value) => setData('password', value)}
                        />

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordar sesión</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <LoginButton processing={processing} />
                    </form>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 font-medium mb-1">
                            📋 Credenciales de prueba:
                        </p>
                        <p className="text-xs text-blue-600">Email: admin@empresa.com</p>
                        <p className="text-xs text-blue-600">Contraseña: admin123</p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        Sistema de Gestión de Recursos Humanos © 2025
                    </p>
                </div>
            </div>
        </div>
    );
}
