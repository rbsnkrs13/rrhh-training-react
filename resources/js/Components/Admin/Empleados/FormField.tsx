interface FormFieldProps {
    label: string;
    type: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
    min?: string;
    max?: string;
    step?: string;
}

export default function FormField({
    label,
    type,
    value,
    onChange,
    error,
    placeholder,
    required,
    min,
    max,
    step,
}: FormFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
                step={step}
            />
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
