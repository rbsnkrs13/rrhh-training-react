interface StatusMessageProps {
    status?: string;
}

export default function StatusMessage({ status }: StatusMessageProps) {
    if (!status) return null;

    return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{status}</p>
        </div>
    );
}
