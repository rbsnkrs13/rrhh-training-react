# Guía de Usuario - Panel de Administración

## Índice
1. [Acceso al Sistema](#acceso-al-sistema)
2. [Dashboard](#dashboard)
3. [Gestión de Empleados](#gestión-de-empleados)
4. [Sistema de Fichajes](#sistema-de-fichajes)
5. [Gestión de Nóminas](#gestión-de-nóminas)
6. [Sistema de Mensajería](#sistema-de-mensajería)

---

## Acceso al Sistema

### Credenciales
- **Email:** admin@empresa.com
- **Contraseña:** [Configurada por el sistema]

### URL de acceso
```
http://tu-dominio.com/login
```

Una vez autenticado, serás redirigido automáticamente al Dashboard de Administración.

---

## Dashboard

El dashboard proporciona una vista general del estado de la empresa en tiempo real.

### Métricas Principales

#### 📊 Total Empleados
- Número total de empleados registrados en el sistema
- Código de color verde: estado saludable

#### ✅ Empleados Activos
- Empleados con estado "activo" en el sistema
- Muestra el ratio de retención del personal
- **Alerta naranja:** Si hay menos de 80% de empleados activos
- **Alerta roja:** Si hay menos de 50% de empleados activos

#### 👥 Contrataciones del Mes
- Nuevas incorporaciones en el período seleccionado
- Permite filtrar por mes y año específico

#### 💰 Promedio Salarial
- Media salarial de todos los empleados activos
- Calculado automáticamente desde la base de datos

### Métricas Secundarias

#### 🔴 Empleados Inactivos
- Personal que ha sido dado de baja
- **Alerta:** Se muestra en rojo si supera el 20% del total

#### ⏰ Antigüedad Media
- Promedio de años de servicio del personal
- Indicador de estabilidad laboral

#### 📈 Distribución Salarial
- Rango desde el salario mínimo al máximo
- Útil para análisis de equidad salarial

#### 🎯 Ratio de Retención
- Porcentaje de empleados activos vs total
- Verde: >80% | Naranja: 50-80% | Rojo: <50%

### Filtros de Dashboard

**Selector de Período:**
- Mes actual por defecto
- Permite seleccionar cualquier mes desde 2020 hasta hoy
- Las métricas se recalculan automáticamente

**Acciones Rápidas:**
- 📝 Ver Empleados
- ⏰ Ver Fichajes
- 💵 Ver Nóminas

---

## Gestión de Empleados

### Listar Empleados

Ruta: `/admin/empleados`

#### Vista de Lista
- Tabla paginada con todos los empleados
- Tarjetas expandibles con información detallada
- Indicadores visuales de estado (activo/inactivo)

#### Filtros Avanzados

**Búsqueda:**
- Por nombre
- Por email
- Por DNI

**Filtrar por Departamento:**
- Desarrollo
- Marketing
- Ventas
- RRHH
- Administración
- Soporte

**Filtrar por Estado:**
- Activos
- Inactivos

**Ordenar por:**
- Nombre (A-Z / Z-A)
- Email (A-Z / Z-A)
- Fecha de contratación (Reciente / Antiguo)
- Salario (Mayor / Menor)

### Crear Empleado

Ruta: `/admin/empleados/create`

#### Campos Obligatorios
- **Nombre completo:** Mínimo 3 caracteres
- **Email:** Formato válido, único en el sistema
- **DNI:** Formato español (8 dígitos + letra), único
- **Teléfono:** Formato español
- **Fecha de nacimiento:** Formato DD/MM/YYYY
- **Dirección completa**
- **Fecha de contratación:** Formato DD/MM/YYYY
- **Departamento:** Selección de lista
- **Puesto**
- **Salario:** Número positivo con 2 decimales

#### Campos Opcionales
- **Notas:** Información adicional sobre el empleado

#### Estado
- **Activo/Inactivo:** Checkbox (activo por defecto)

#### Validaciones
- Email duplicado: Error en tiempo real
- DNI duplicado: Error en tiempo real
- Salario mínimo: 0€
- Formato de fechas validado

### Editar Empleado

Ruta: `/admin/empleados/{id}/edit`

- Mismo formulario que crear
- Pre-rellenado con datos actuales
- Validación de email único (excepto el propio)
- Confirmación antes de guardar cambios

### Eliminar Empleado

- Botón de eliminar en la tarjeta del empleado
- **Confirmación obligatoria** antes de eliminar
- Acción irreversible
- Se eliminan también sus fichajes y nóminas asociados

### Ver Detalles

Al expandir la tarjeta del empleado se muestra:
- Información personal completa
- Datos de contrato
- Últimos 30 fichajes
- Últimas 12 nóminas
- Estadísticas del mes actual:
  - Total fichajes realizados
  - Horas trabajadas este mes
  - Días trabajados este mes

---

## Sistema de Fichajes

### Dashboard de Fichajes

Ruta: `/admin/fichajes`

#### KPIs en Tiempo Real

**Empleados Fichados Hoy:**
- Número de empleados que han fichado al menos una vez hoy
- Porcentaje sobre el total de empleados

**Sin Fichar:**
- Empleados que aún no han registrado entrada
- **Alerta roja** si el número es alto

**Entradas Abiertas:**
- Empleados actualmente trabajando (sin salida registrada)
- Útil para saber quién está en la oficina

**Horas Totales Hoy:**
- Suma de horas trabajadas por todos los empleados hoy

#### Selector de Empleado
- Dropdown con lista completa de empleados
- Búsqueda por nombre
- Ver fichajes individuales de cualquier empleado

#### Tabla de Fichajes
- Fecha y hora de cada fichaje
- Tipo: Entrada/Salida
- Empleado que lo realizó
- Horas trabajadas (calculadas automáticamente)
- Ordenados del más reciente al más antiguo

#### Últimos Fichajes en Tiempo Real
- Panel lateral con los 10 fichajes más recientes
- Se actualiza automáticamente
- Muestra: empleado, hora, tipo de fichaje

### Historial de Fichajes

Ruta: `/admin/fichajes/empleado/{id}`

#### Filtros
- **Por fecha:** Selector de rango de fechas
- **Por empleado:** Dropdown de selección
- **Por tipo:** Entrada/Salida/Todos

#### Exportar
- Botón "Exportar CSV"
- Descarga archivo con todos los fichajes filtrados
- Incluye: fecha, hora, tipo, empleado, departamento

#### Estadísticas del Período
- Total de horas trabajadas
- Promedio de horas por día
- Días trabajados
- Días sin fichar

---

## Gestión de Nóminas

Ruta: `/admin/nominas`

### Estadísticas Generales

**Nóminas del Mes Anterior:**
- Total de nóminas procesadas
- Gasto total en nóminas
- Empleados que recibieron nómina
- Promedio por empleado

**Nóminas Pendientes:**
- Archivos subidos sin datos completos
- Requieren completar salario bruto/neto

**Cobertura:**
- Porcentaje de empleados con nómina del mes anterior
- **Alerta** si es inferior al 90%

### Subir Nóminas

#### Subida Individual
1. Seleccionar empleado del dropdown
2. Seleccionar mes y año
3. Elegir archivo PDF
4. Ingresar salario bruto y neto
5. Click en "Subir Nómina"

#### Subida Masiva
1. Click en "Subir Múltiples Nóminas"
2. Seleccionar empleado
3. Elegir varios archivos PDF (máximo 10)
4. Cada archivo se nombra automáticamente por mes/año
5. Ingresar datos salariales para cada uno
6. "Guardar Todas"

**Validaciones:**
- Solo archivos PDF
- Máximo 10MB por archivo
- Salarios deben ser positivos
- No duplicar nóminas del mismo mes/empleado

### Listado de Nóminas

#### Filtros
- **Por período:** Mes/Año específico
- **Por empleado:** Dropdown de selección
- **Por estado:** Completas / Pendientes

#### Tabla de Nóminas
Columnas:
- Empleado
- Mes/Año
- Salario Bruto
- Salario Neto
- Estado (completa/pendiente)
- Acciones (Editar/Eliminar/Descargar)

#### Acciones
- **Editar:** Modificar salarios o reemplazar PDF
- **Eliminar:** Borrar nómina (con confirmación)
- **Descargar:** Obtener PDF de la nómina

---

## Sistema de Mensajería

Ruta: `/admin/mensajes`

### Vista Principal

**Diseño tipo WhatsApp Web:**
- Sidebar izquierdo: Lista de conversaciones
- Panel derecho: Chat activo

### Lista de Conversaciones

**Muestra:**
- Foto/avatar del empleado
- Nombre del empleado
- Último mensaje enviado
- Hora del último mensaje
- Número de mensajes no leídos (badge)

**Ordenamiento:**
- Por defecto: conversación más reciente arriba
- Auto-actualización cuando llegan mensajes nuevos

### Panel de Chat

**Cabecera:**
- Nombre del empleado
- Email del empleado
- Estado (online/offline - futuro)

**Área de mensajes:**
- Mensajes propios: alineados a la derecha (azul)
- Mensajes del empleado: alineados a la izquierda (gris)
- Hora de envío en cada mensaje
- Scroll automático al último mensaje

**Input de mensaje:**
- Área de texto para escribir
- Botón de enviar
- Enter para enviar rápido
- Shift+Enter para nueva línea

### Funcionalidades en Tiempo Real

**WebSocket:**
- Mensajes llegan instantáneamente sin recargar
- Notificaciones sonoras (futuro)
- Indicador de "escribiendo..." (futuro)

**Contador de No Leídos:**
- Se actualiza automáticamente
- Visible en el botón flotante de chat
- Se resetea al abrir conversación

### Botón Flotante

**Ubicación:** Esquina inferior derecha

**Funcionalidad:**
- Badge con número de mensajes no leídos
- Click para abrir vista de mensajes
- Visible en todas las páginas del admin

---

## Navegación General

### Menú Principal

**Dashboard:** Vista general del sistema
**Empleados:** CRUD completo de personal
**Fichajes:** Sistema de control horario
**Nóminas:** Gestión de archivos de nóminas
**Mensajes:** Chat con empleados

### Dropdown de Usuario

**Acciones:**
- Ver perfil
- Cerrar sesión

### Notificaciones

- Mensajes no leídos (badge en navbar)
- Flash messages después de acciones (crear, editar, eliminar)
- Alertas en dashboard por umbrales críticos

---

## Mejores Prácticas

### Seguridad
✅ Cerrar sesión al terminar
✅ No compartir credenciales de admin
✅ Revisar logs de actividad regularmente

### Gestión de Empleados
✅ Mantener datos actualizados
✅ Revisar estado de empleados mensualmente
✅ Documentar notas importantes en el perfil

### Fichajes
✅ Revisar entradas abiertas al final del día
✅ Exportar reportes semanales/mensuales
✅ Verificar discrepancias de horas

### Nóminas
✅ Subir nóminas antes del día 5 de cada mes
✅ Verificar que todos los empleados tengan nómina
✅ Hacer backup de archivos PDF

### Mensajería
✅ Responder en máximo 24 horas
✅ Mantener comunicación profesional
✅ Archivar conversaciones resueltas (futuro)

---

## Soporte

**Documentación técnica:** Ver `docs/admin/02-documentacion-tecnica.md`
**Arquitectura del código:** Ver `docs/admin/03-arquitectura.md`
**API Reference:** Ver `docs/admin/04-api-reference.md`

**Contacto técnico:** [Tu información de contacto]
