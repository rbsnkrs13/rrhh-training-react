//Vista creada para las tarjetas de metricas
export default function MetricCard({ titulo, valor, color = "blue" }) {
    const colorClasses = {
        blue: "text-blue-600",
        green: "text-green-600", 
        red: "text-red-600",
        yellow: "text-yellow-600"
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">{titulo}</h3>
            <p className={`text-3xl font-bold ${colorClasses[color]}`}>{valor}</p>
        </div>
    );
}