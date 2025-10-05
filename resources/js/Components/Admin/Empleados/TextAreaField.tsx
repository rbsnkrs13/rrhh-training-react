interface TextAreaFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    rows?: number;
}

export default function TextAreaField({
    label,
    value,
    onChange,
    error,
    placeholder,
    rows = 3,
}: TextAreaFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <textarea
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={rows}
                placeholder={placeholder}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
