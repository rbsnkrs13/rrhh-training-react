# 📋 Empleados con DNI - Para Generar Nóminas

## Lista de Empleados

| ID | Nombre Completo | Email | DNI |
|----|-----------------|-------|-----|
| 1 | Admin RRHH | admin@empresa.com | **12345678A** |
| 2 | María García López | maria.garcia@empresa.com | **23456789B** |
| 3 | Carlos Rodríguez Sánchez | carlos.rodriguez@empresa.com | **34567890C** |
| 4 | Ana Martínez Fernández | ana.martinez@empresa.com | **45678901D** |
| 5 | David López Pérez | david.lopez@empresa.com | **56789012E** |
| 6 | Laura Hernández Ruiz | laura.hernandez@empresa.com | **67890123F** |
| 7 | Jorge Silva Torres | jorge.silva@empresa.com | **78901234G** |

---

## 📝 Formato de Archivo de Nómina

Para que el sistema pueda procesar automáticamente los PDFs:

**Nombre del archivo**: `DNI_NombreApellido_YYYYMM.pdf`

### Ejemplos:
- `12345678A_AdminRRHH_202501.pdf`
- `23456789B_MariaGarcia_202501.pdf`
- `34567890C_CarlosRodriguez_202501.pdf`

**Importante**: El DNI debe estar al inicio del nombre del archivo.

---

## 🤖 Prompt para Claude.ai

Puedes usar este prompt en Claude.ai para generar las nóminas:

```
Necesito que me generes 7 PDFs de nóminas ficticias para los siguientes empleados (formato español):

1. DNI: 12345678A - Admin RRHH - Salario: 3.500€
2. DNI: 23456789B - María García López - Salario: 2.800€
3. DNI: 34567890C - Carlos Rodríguez Sánchez - Salario: 3.200€
4. DNI: 45678901D - Ana Martínez Fernández - Salario: 2.600€
5. DNI: 56789012E - David López Pérez - Salario: 2.900€
6. DNI: 67890123F - Laura Hernández Ruiz - Salario: 3.100€
7. DNI: 78901234G - Jorge Silva Torres - Salario: 2.700€

Para cada nómina, incluye:
- Mes: Enero 2025
- Salario Bruto: (el indicado arriba)
- Deducciones Seguridad Social: ~6.35% del bruto
- Deducciones IRPF: ~15% del bruto
- Líquido a percibir: Bruto - SS - IRPF

El formato debe ser un PDF simple con texto claro y parseble.
Incluye estos textos exactos para que mi sistema los detecte:
- "Salario Bruto: X,XX €"
- "Seguridad Social: X,XX €"
- "IRPF: X,XX €"
- "Líquido a percibir: X,XX €"

Los nombres de archivo deben ser:
- 12345678A_AdminRRHH_202501.pdf
- 23456789B_MariaGarcia_202501.pdf
- etc...
```

---

## ✅ Sistema de Extracción Automática

El sistema buscará estos patrones en el PDF:

### Salario Bruto:
- "Salario Bruto: X,XX"
- "Total Devengado: X,XX"
- "Bruto: X,XX"

### Salario Neto:
- "Líquido a percibir: X,XX"
- "Total Neto: X,XX"
- "Neto: X,XX"

### Deducciones SS:
- "Seguridad Social: X,XX"
- "S.Social: X,XX"
- "SS: X,XX"
- "Cotización: X,XX"

### Deducciones IRPF:
- "IRPF: X,XX"
- "I.R.P.F.: X,XX"
- "Retención IRPF: X,XX"

**Formato de moneda soportado**:
- Europeo: `2.500,00` o `2500,00`
- Anglosajón: `2,500.00` o `2500.00`

---

## 🎯 Recomendación Claude.ai

**Sí, usa Claude.ai** para generar los PDFs. Ventajas:

1. ✅ Puede generar PDFs con artifacts
2. ✅ Entiende formatos de nómina española
3. ✅ Puede crear texto estructurado parseble
4. ✅ Puedes pedirle ajustes si el parser falla

**Alternativa más rápida**: Pedirle que genere **HTML que luego conviertas a PDF** con:
- Chrome (Imprimir → Guardar como PDF)
- wkhtmltopdf
- Cualquier conversor online

---

## 🧪 Prueba del Sistema

Una vez tengas los PDFs:

1. Ve a `/admin/nominas`
2. Sube todos los PDFs de golpe (drag & drop)
3. El sistema validará los DNIs automáticamente
4. Intentará extraer salarios del contenido
5. Si falla → podrás editarlos manualmente con el botón "Editar"

**Los empleados verán las nóminas** en su dashboard cuando tengan salarios completos.
