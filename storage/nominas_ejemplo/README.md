# 📄 Nóminas de Ejemplo - Sistema RRHH

Esta carpeta contiene nóminas de ejemplo para probar el sistema de gestión de nóminas con parsing automático.

## 📁 Estructura

```
storage/nominas_ejemplo/
├── htmls/                          # 7 nóminas en formato HTML
│   ├── 1_12345678A_AdminRRHH_202501.html
│   ├── 2_23456789B_MariaGarcia_202501.html
│   ├── 3_34567890C_CarlosRodriguez_202501.html
│   ├── 4_45678901D_AnaMartinez_202501.html
│   ├── 5_56789012E_DavidLopez_202501.html
│   ├── 6_67890123F_LauraHernandez_202501.html
│   └── 7_78901234G_JorgeSilva_202501.html
├── pdfs/                           # PDFs generados (se crean con el script)
├── generar_pdfs.ps1               # Script PowerShell para generar PDFs
└── README.md                       # Este archivo
```

---

## 🚀 Uso Rápido

### 1. Actualizar período de las nóminas (OPCIONAL)

Si quieres que las nóminas tengan el mes/año actual en lugar de Enero 2025:

```powershell
powershell -ExecutionPolicy Bypass -File storage/nominas_ejemplo/actualizar_periodo_htmls.ps1
```

Este script actualiza automáticamente:
- ✅ Período: mes/año actual
- ✅ Fecha de emisión: fecha actual
- ✅ Títulos de las páginas

### 2. Generar los PDFs

Ejecuta el script PowerShell desde la raíz del proyecto:

```powershell
powershell -ExecutionPolicy Bypass -File storage/nominas_ejemplo/generar_pdfs.ps1
```

**Requisitos**: Google Chrome instalado.

El script:
- ✅ Busca Chrome automáticamente
- ✅ **Detecta automáticamente el año/mes actual**
- ✅ Convierte los 7 HTMLs a PDF
- ✅ Los guarda en `storage/nominas_ejemplo/pdfs/`
- ✅ Con el formato correcto: `DNI_Nombre_YYYYMM.pdf` (usando período actual)

### 3. Probar el Sistema

1. Inicia el servidor:
   ```bash
   composer run dev
   ```

2. Ve a: `http://localhost:8000/admin/nominas`

3. Arrastra los 7 PDFs desde `storage/nominas_ejemplo/pdfs/`

4. Haz clic en "Subir"

### 4. Verificar Resultados

El sistema automáticamente:
- ✅ Extrae el DNI del nombre del archivo
- ✅ Busca al empleado correspondiente
- ✅ Parsea los salarios del contenido del PDF
- ✅ Extrae deducciones (SS e IRPF)
- ✅ Calcula si la nómina está completa

---

## 📊 Datos de las Nóminas

| Empleado | DNI | Salario Bruto | Salario Neto |
|----------|-----|---------------|--------------|
| Admin RRHH | 12345678A | 3.500,00 € | 2.752,75 € |
| María García López | 23456789B | 2.800,00 € | 2.202,20 € |
| Carlos Rodríguez Sánchez | 34567890C | 3.200,00 € | 2.516,80 € |
| Ana Martínez Fernández | 45678901D | 2.600,00 € | 2.044,90 € |
| David López Pérez | 56789012E | 2.900,00 € | 2.280,85 € |
| Laura Hernández Ruiz | 67890123F | 3.100,00 € | 2.438,15 € |
| Jorge Silva Torres | 78901234G | 2.700,00 € | 2.123,55 € |

---

## 🔧 Conversión Manual (Alternativa)

Si no quieres usar el script PowerShell:

1. Abre cada archivo `.html` en Chrome
2. Presiona `Ctrl + P`
3. Selecciona "Guardar como PDF"
4. Guarda con el nombre correcto:
   - `12345678A_AdminRRHH_202501.pdf`
   - `23456789B_MariaGarcia_202501.pdf`
   - etc...

---

## 🧪 Testing del Parser Automático

Los PDFs están diseñados para probar el sistema de parsing automático.

**Textos parseables incluidos**:
- `Salario Bruto: X.XXX,XX €`
- `Seguridad Social: XXX,XX €`
- `IRPF: XXX,XX €`
- `Líquido a percibir: X.XXX,XX €`

Si el parser funciona correctamente, **todos los campos deberían llenarse automáticamente**.

---

## ✅ Validación Post-Subida

Después de subir las nóminas, verifica:

1. **Admin Dashboard** (`/admin/nominas`):
   - ✓ Las 7 nóminas aparecen en la tabla
   - ✓ Salarios bruto y neto completados
   - ✓ Estadísticas actualizadas

2. **Dashboard Empleado** (cualquier usuario no-admin):
   - ✓ Su nómina aparece en el widget "Mis Nóminas"
   - ✓ Muestra salario bruto y neto
   - ✓ Puede descargar el PDF

3. **Vista Empleado Nóminas** (`/mis-nominas`):
   - ✓ Solo muestra nóminas con datos completos
   - ✓ Estadísticas correctas

---

## 🎯 Propósito Educativo

Estos archivos están incluidos en el repositorio para:

1. **Demostración**: Cualquiera puede clonar el repo y probar el sistema inmediatamente
2. **Testing**: Validar el parser automático de PDFs
3. **Ejemplo**: Mostrar el formato correcto de nóminas
4. **Onboarding**: Nuevos desarrolladores pueden ver cómo funciona sin crear datos ficticios

---

## 📝 Notas Técnicas

### Formato de Nombre de Archivo
**Importante**: El DNI debe estar al inicio del nombre para que el sistema lo detecte.

**Formato correcto**: `DNI_Nombre_YYYYMM.pdf`

Ejemplos válidos:
- ✅ `12345678A_AdminRRHH_202501.pdf`
- ✅ `23456789B_Maria_202501.pdf`
- ✅ `34567890C_202501.pdf`

Ejemplos inválidos:
- ❌ `nomina_12345678A_202501.pdf` (DNI no al inicio)
- ❌ `enero_admin.pdf` (sin DNI)

### Parser Automático
El sistema usa **smalot/pdfparser** para extraer texto y buscar patrones de:
- Salarios (bruto/neto)
- Deducciones (SS/IRPF)

Soporta formatos de moneda:
- Europeo: `2.500,00` o `2500,00`
- Anglosajón: `2,500.00` o `2500.00`

---

## 🐛 Troubleshooting

### El script PowerShell no funciona

**Error**: "Chrome no encontrado"
- **Solución**: Instala Google Chrome o edita el script con la ruta correcta

**Error**: "Execution Policy"
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### Los PDFs no parsean correctamente

1. Verifica el contenido del PDF abriendo en un visor
2. Busca los textos exactos: "Salario Bruto:", "Líquido a percibir:", etc.
3. Si falla, usa el botón "Editar" en `/admin/nominas` para completar manualmente

### Las nóminas no aparecen para los empleados

- Verifica que `salario_bruto` y `salario_neto` no sean NULL
- Los empleados solo ven nóminas con datos completos
- Usa el modal de edición del admin para completar datos faltantes

---

## 📖 Más Información

Para más detalles sobre el sistema de nóminas, consulta:
- [EMPLEADOS_CON_DNI.md](../../EMPLEADOS_CON_DNI.md) - Lista completa de empleados con DNIs
- [CLAUDE.md](../../CLAUDE.md) - Documentación del proyecto completo
