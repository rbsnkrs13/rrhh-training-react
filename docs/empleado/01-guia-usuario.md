# Guía de Usuario - Portal del Empleado

## Índice
1. [Acceso al Sistema](#acceso-al-sistema)
2. [Dashboard Personal](#dashboard-personal)
3. [Sistema de Fichajes](#sistema-de-fichajes)
4. [Mis Nóminas](#mis-nóminas)
5. [Chat con Administración](#chat-con-administración)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## Acceso al Sistema

### Primera vez
**URL:** `http://tu-dominio.com/login`

**Credenciales:**
- **Email:** El email corporativo que te proporcionó RRHH
- **Contraseña:** Password temporal (cambiarla en el primer acceso)

### Olvidé mi contraseña
1. Click en "¿Olvidaste tu contraseña?"
2. Ingresa tu email corporativo
3. Recibirás un email con instrucciones para resetearla

---

## Dashboard Personal

Tu panel principal muestra toda la información relevante de un vistazo.

### 🕐 Reloj y Estado Actual
**Ubicación:** Parte superior central

**Muestra:**
- Hora actual
- Tu estado de fichaje (Fichado / Sin fichar)
- Hora de tu última entrada (si estás fichado)

### 📊 Resumen Semanal
**Horas trabajadas esta semana:**
- Barra de progreso visual
- Horas completadas vs horas objetivo
- Ejemplo: "32h / 40h" (80%)

**Códigos de color:**
- 🟢 Verde: >90% completado
- 🟡 Amarillo: 70-90% completado
- 🔴 Rojo: <70% completado

### ⏰ Fichajes Recientes
**Últimos 7 días de trabajo:**
- Fecha
- Horas trabajadas ese día
- Check verde si completaste 8h

### 💰 Nóminas Recientes
**Últimas 5 nóminas disponibles:**
- Mes/Año
- Salario neto
- Botón de descarga (requiere contraseña)

### 👤 Información Personal
- Nombre completo
- Email corporativo
- Departamento
- Puesto
- Fecha de contratación
- Antigüedad en la empresa

### 🚀 Acciones Rápidas
Botones para:
- Fichar Entrada/Salida
- Ver historial de fichajes
- Descargar nóminas
- Contactar con Administración

---

## Sistema de Fichajes

### Fichar Entrada/Salida

**Ubicación:** Dashboard o página `/fichajes`

#### Fichar Entrada
1. Click en botón "Fichar Entrada"
2. Se registra automáticamente:
   - Fecha: Hoy
   - Hora: Hora actual
   - Tipo: Entrada
3. Verás confirmación: "✅ Entrada registrada a las HH:MM"

**Restricciones:**
- Solo si no tienes una entrada abierta
- No puedes fichar entrada dos veces seguidas

#### Fichar Salida
1. Click en botón "Fichar Salida"
2. Se registra automáticamente:
   - Fecha: Hoy
   - Hora: Hora actual
   - Tipo: Salida
   - Se calculan las horas trabajadas
3. Verás confirmación: "✅ Salida registrada. Trabajaste X horas hoy"

**Restricciones:**
- Solo si tienes una entrada abierta
- No puedes fichar salida si no fichaste entrada

### Historial de Fichajes

**Ruta:** `/fichajes/historial`

#### Filtros
**Por período:**
- Esta semana
- Este mes
- Mes pasado
- Personalizado (rango de fechas)

#### Vista de Tabla
Columnas:
- Fecha
- Entrada (HH:MM)
- Salida (HH:MM)
- Horas trabajadas
- Estado (completo/incompleto)

**Indicadores:**
- ✅ Verde: Día completo (≥8h)
- ⚠️ Amarillo: Día parcial (4-8h)
- ❌ Rojo: Entrada sin salida

### Estadísticas del Período

**Resumen automático:**
- Total horas trabajadas
- Promedio horas/día
- Días trabajados
- Días sin fichar

**Gráfico de horas:**
- Barras mostrando horas por día
- Línea objetivo de 8h
- Fácil identificar días incompletos

### Exportar Historial

**Botón "Descargar CSV":**
- Genera archivo Excel-compatible
- Incluye todos los fichajes del período filtrado
- Útil para registros personales

---

## Mis Nóminas

**Ruta:** `/mis-nominas`

### Lista de Nóminas

**Vista de tarjetas:**
- Mes/Año
- Salario bruto
- Salario neto
- Estado (disponible/procesando)
- Botón "Descargar PDF"

**Ordenamiento:**
Por defecto: más reciente primero

### Descargar Nómina

**Proceso seguro:**
1. Click en "Descargar PDF"
2. Modal solicita tu contraseña
3. Ingresas tu contraseña actual
4. Click en "Verificar y descargar"
5. Si es correcta: descarga automática del PDF
6. Si es incorrecta: mensaje de error

**¿Por qué pide contraseña?**
Medida de seguridad para proteger tus datos salariales. Así, si alguien usa tu ordenador sin permiso, no puede acceder a tus nóminas.

### Nómina Pendiente

Si ves una nómina con estado "Pendiente":
- El archivo aún no está completo
- Contacta con Administración
- Normalmente se completa en 24-48h

---

## Chat con Administración

### Abrir Chat

**Botón flotante:** Esquina inferior derecha (en todas las páginas)

**Indicadores:**
- Badge rojo: Tienes mensajes sin leer
- Número: Cantidad de mensajes no leídos

### Panel de Chat

**Vista lateral deslizable:**
- Se abre desde la derecha
- Ocupa 1/3 de la pantalla
- Puedes seguir viendo el resto de la página

#### Cabecera
- Título: "Chat con Administración"
- Subtítulo: "Respuesta en menos de 24h"
- Botón X para cerrar

#### Área de Mensajes
**Tus mensajes:** Burbujas azules a la derecha
**Mensajes de Admin:** Burbujas grises a la izquierda

**Cada mensaje muestra:**
- Texto del mensaje
- Hora de envío
- Nombre del remitente

**Auto-scroll:**
Siempre muestra el mensaje más reciente automáticamente

#### Escribir Mensaje

**Campo de texto:**
- Escribe tu consulta/mensaje
- Máximo 5000 caracteres
- Admite saltos de línea (Shift + Enter)

**Enviar:**
- Click en botón "Enviar"
- O presiona Enter

**Confirmación:**
El mensaje aparece inmediatamente en el chat (no necesitas refrescar)

### Mensajes en Tiempo Real

**Tecnología WebSocket:**
- Los mensajes del admin llegan instantáneamente
- No necesitas recargar la página
- Verás cuándo están escribiendo (próximamente)

**Notificaciones:**
- Badge actualizado automáticamente
- Mensaje nuevo aparece sin refresh

### Buenas Prácticas

✅ **Sé claro y conciso**
- Describe tu problema/pregunta de forma específica
- Incluye detalles relevantes

✅ **Profesionalidad**
- Mantén un tono respetuoso
- Usa lenguaje apropiado para el trabajo

✅ **Paciencia**
- Respuesta en <24h hábiles
- No envíes el mismo mensaje múltiples veces

✅ **Temas apropiados**
- Consultas sobre nóminas, fichajes, vacaciones
- Dudas administrativas
- Solicitudes de documentos

❌ **Evitar:**
- Mensajes fuera de horario laboral urgentes (usa email/teléfono)
- Temas personales no relacionados con trabajo
- Información sensible (usa canales oficiales)

---

## Navegación General

### Menú Principal

**Dashboard** - Vista general personalizada
**Fichajes** - Registrar entrada/salida
**Mis Nóminas** - Descargar nóminas

### Dropdown de Usuario

**Ubicación:** Esquina superior derecha

**Opciones:**
- Ver/Editar Perfil
- Cambiar contraseña
- Cerrar sesión

### Mensajes Rápidos

**Flash Messages:**
Aparecen temporalmente después de acciones:
- "✅ Entrada registrada correctamente"
- "✅ Nómina descargada"
- "❌ Error: Ya tienes una entrada abierta"

**Duración:** 5 segundos (desaparecen automáticamente)

---

## Preguntas Frecuentes

### ❓ ¿Qué hago si olvidé fichar la salida?

**Respuesta:**
Contacta con Administración inmediatamente vía chat o email. Pueden corregir el registro manualmente.

### ❓ ¿Puedo fichar desde mi móvil?

**Respuesta:**
Sí, el sistema es responsive y funciona perfectamente desde cualquier dispositivo con internet.

### ❓ ¿Puedo ver fichajes de meses anteriores?

**Respuesta:**
Sí, en "Historial de fichajes" puedes filtrar por cualquier período.

### ❓ Mi nómina no está disponible aún

**Respuesta:**
Las nóminas se suben normalmente entre el día 1 y 5 de cada mes. Si pasado el día 5 no la ves, contacta con Administración.

### ❓ Olvidé mi contraseña

**Respuesta:**
Usa la opción "¿Olvidaste tu contraseña?" en la pantalla de login. Recibirás un email para resetearla.

### ❓ ¿Cómo cambio mi contraseña?

**Respuesta:**
1. Click en tu nombre (esquina superior derecha)
2. "Ver perfil"
3. Sección "Actualizar contraseña"
4. Ingresa contraseña actual y nueva contraseña
5. "Guardar cambios"

### ❓ ¿Puedo descargar todas mis nóminas a la vez?

**Respuesta:**
Actualmente no, debes descargar una por una. Función de descarga múltiple en desarrollo.

### ❓ El chat no me muestra mensajes nuevos

**Respuesta:**
1. Verifica tu conexión a internet
2. Refresca la página (F5)
3. Si persiste, contacta soporte técnico

### ❓ ¿Cuánto tiempo se guardan mis fichajes?

**Respuesta:**
Todos tus fichajes se guardan permanentemente mientras seas empleado activo. Tras dejar la empresa, se archivan según normativa legal.

---

## Soporte

### Ayuda Técnica
**Chat con Administración:** Botón flotante
**Email:** rrhh@tu-empresa.com
**Teléfono:** XXX XXX XXX (horario 9-18h)

### Documentación Adicional
- Manual de bienvenida (recibirás al ingresar)
- Política de fichajes
- Normativa interna de la empresa

---

¡Bienvenido al equipo! 🎉
