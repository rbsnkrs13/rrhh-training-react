interface EmailInputProps {
    value: string;
    error?: string;
    onChange: (value: string) => void;
}

export default function EmailInput({ value, error, onChange }: EmailInputProps) {
    return (
        <div>
            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Correo Electrónico
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
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                    </svg>
                </div>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={value}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                    placeholder="admin@empresa.com"
                    autoComplete="username"
                    autoFocus
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
