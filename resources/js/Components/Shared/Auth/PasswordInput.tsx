interface PasswordInputProps {
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function PasswordInput({ value, error, onChange }: PasswordInputProps) {
    return (
        <div>
            <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Contraseña
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                </div>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={value}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    onChange={e => onChange(e.target.value)}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    {error}
                </p>
            )}
        </div>
    );
}
