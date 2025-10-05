interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
}

export default function SelectField({
    label,
    value,
    onChange,
    error,
    options,
    placeholder,
    required,
    disabled,
}: SelectFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required={required}
                disabled={disabled}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
