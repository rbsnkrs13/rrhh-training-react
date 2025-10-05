<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nómina - {{ $empleado['nombre'] }} - {{ $mes }} {{ $año }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .document-title {
            font-size: 20px;
            color: #555;
            margin-top: 10px;
        }
        .info-section {
            margin-bottom: 25px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        .label {
            font-weight: bold;
            color: #555;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th {
            background-color: #2c3e50;
            color: white;
            padding: 12px;
            text-align: left;
        }
        td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
        }
        .amount {
            text-align: right;
        }
        .total-section {
            background-color: #f8f9fa;
            padding: 20px;
            margin-top: 30px;
            border-left: 4px solid #2c3e50;
        }
        .total-liquido {
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
            text-align: right;
            margin-top: 10px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Tech Solutions S.L.</div>
        <div class="document-title">NÓMINA</div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span><span class="label">Empleado:</span> {{ $empleado['nombre'] }}</span>
            <span><span class="label">DNI:</span> {{ $empleado['dni'] }}</span>
        </div>
        <div class="info-row">
            <span><span class="label">Período:</span> {{ $mes }} {{ $año }}</span>
            <span><span class="label">Fecha de emisión:</span> {{ $fecha_emision }}</span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Conceptos Devengados</th>
                <th class="amount">Importe</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Salario Base</td>
                <td class="amount">{{ number_format($empleado['salario_bruto'], 2, ',', '.') }} €</td>
            </tr>
            <tr>
                <td><strong>Salario Bruto:</strong></td>
                <td class="amount"><strong>{{ number_format($empleado['salario_bruto'], 2, ',', '.') }} €</strong></td>
            </tr>
        </tbody>
    </table>

    <table>
        <thead>
            <tr>
                <th>Deducciones</th>
                <th class="amount">Importe</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Seguridad Social:</td>
                <td class="amount">{{ number_format($empleado['ss'], 2, ',', '.') }} €</td>
            </tr>
            <tr>
                <td>IRPF:</td>
                <td class="amount">{{ number_format($empleado['irpf'], 2, ',', '.') }} €</td>
            </tr>
        </tbody>
    </table>

    <div class="total-section">
        <div class="total-liquido">Líquido a percibir: {{ number_format($salario_neto, 2, ',', '.') }} €</div>
    </div>

    <div class="footer">
        <p>Documento generado el {{ $fecha_emision }}</p>
    </div>
</body>
</html>
