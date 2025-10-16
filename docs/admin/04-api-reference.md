# API Reference - Endpoints Disponibles

## Base URL
```
http://tu-dominio.com
```

## Autenticación

Todas las rutas excepto `/login` requieren autenticación.

### POST /login
Autenticar usuario

**Body:**
```json
{
  "email": "admin@empresa.com",
  "password": "password"
}
```

**Response 200:**
Redirect a `/admin/dashboard` o `/dashboard`

---

## Admin - Empleados

### GET /admin/empleados
Listar empleados con filtros

**Query Params:**
- `busqueda` (string): Búsqueda por nombre/email/DNI
- `departamento` (string): Filtrar por departamento
- `estado` (boolean): true=activos, false=inactivos
- `ordenPor` (string): nombre_asc|nombre_desc|email_asc|salario_desc

**Response 200:**
```json
{
  "empleados": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@empresa.com",
      "dni": "12345678A",
      "departamento": "Desarrollo",
      "salario": "35000.00",
      "activo": true
    }
  ]
}
```

### POST /admin/empleados
Crear nuevo empleado

**Body:**
```json
{
  "nombre": "María López",
  "email": "maria@empresa.com",
  "dni": "87654321B",
  "telefono": "600123456",
  "fecha_nacimiento": "1990-05-15",
  "direccion": "Calle Mayor 123",
  "fecha_contratacion": "2024-01-10",
  "departamento": "Marketing",
  "puesto": "Marketing Manager",
  "salario": "40000.00",
  "activo": true,
  "notas": "Experiencia previa en..."
}
```

**Response 302:**
Redirect a `/admin/empleados` con flash message

**Validaciones:**
- nombre: required, min:3
- email: required, email, unique
- dni: required, regex:/^[0-9]{8}[A-Z]$/, unique
- salario: required, numeric, min:0

### PUT /admin/empleados/{id}
Actualizar empleado existente

**Body:** Igual que POST
**Response 302:** Redirect con mensaje de éxito

### DELETE /admin/empleados/{id}
Eliminar empleado

**Response 302:** Redirect con confirmación

---

## Admin - Fichajes

### GET /admin/fichajes
Dashboard de fichajes (todos los empleados)

**Response 200:**
```json
{
  "fichajes": [...],
  "kpis": {
    "empleados_fichados": 25,
    "sin_fichar": 5,
    "entradas_abiertas": 20,
    "horas_totales_hoy": 160.5
  }
}
```

### GET /admin/fichajes/empleado/{id}
Fichajes de un empleado específico

**Query Params:**
- `fecha_inicio` (date): YYYY-MM-DD
- `fecha_fin` (date): YYYY-MM-DD

---

## Admin - Nóminas

### GET /admin/nominas
Listar nóminas

**Query Params:**
- `mes` (int): 1-12
- `año` (int): YYYY
- `empleado_id` (int)

### POST /admin/nominas/subir
Subir nómina individual

**Form Data:**
```
empleado_id: 1
mes: 12
año: 2024
archivo: [PDF file]
salario_bruto: 45000.00
salario_neto: 32000.00
```

**Response 302:** Redirect con éxito

**Validaciones:**
- archivo: required, file, mimes:pdf, max:10240 (10MB)
- salario_bruto: required, numeric, min:0
- salario_neto: required, numeric, min:0

### POST /admin/nominas/subir-masivo
Subir múltiples nóminas

**Form Data:**
```
empleado_id: 1
archivos[]: [PDF file 1]
archivos[]: [PDF file 2]
salarios[0][mes]: 11
salarios[0][año]: 2024
salarios[0][bruto]: 45000.00
salarios[0][neto]: 32000.00
```

### PUT /admin/nominas/{id}
Actualizar datos de nómina

**Body:**
```json
{
  "salario_bruto": "46000.00",
  "salario_neto": "33000.00"
}
```

### DELETE /admin/nominas/{id}
Eliminar nómina

---

## Shared - Mensajes (Admin y Empleado)

### GET /api/messages/conversations
Listar conversaciones del usuario

**Response 200 (Admin):**
```json
[
  {
    "empleadoId": 4,
    "nombre": "Ana Martínez",
    "ultimoMensaje": "Gracias por la información",
    "horaUltimoMensaje": "hace 5 minutos",
    "mensajesNoLeidos": 2
  }
]
```

**Response 200 (Empleado):**
```json
[
  {
    "empleadoId": 1,
    "nombre": "Administración",
    "ultimoMensaje": "",
    "horaUltimoMensaje": "",
    "mensajesNoLeidos": 0
  }
]
```

### GET /api/messages/messages/{userId}
Obtener mensajes de una conversación

**Response 200:**
```json
[
  {
    "id": 1,
    "mensaje": "Hola, necesito ayuda con...",
    "hora": "14:30",
    "esPropio": false,
    "nombreRemitente": "Ana Martínez"
  },
  {
    "id": 2,
    "mensaje": "Claro, en qué puedo ayudarte?",
    "hora": "14:32",
    "esPropio": true,
    "nombreRemitente": "Admin RRHH"
  }
]
```

### POST /api/messages/send
Enviar mensaje

**Body:**
```json
{
  "receiver_id": 4,
  "message": "Te envío la información solicitada..."
}
```

**Response 200:**
```json
{
  "success": true,
  "message": {
    "id": 27,
    "mensaje": "Te envío la información...",
    "hora": "15:45",
    "esPropio": true,
    "nombreRemitente": "Admin RRHH"
  }
}
```

**WebSocket Broadcast:**
Se envía automáticamente al canal `chat.{receiver_id}` vía Laravel Reverb.

### GET /api/messages/unread-count
Contador de mensajes no leídos

**Response 200:**
```json
{
  "count": 5
}
```

### POST /api/messages/mark-read/{senderId}
Marcar mensajes como leídos

**Response 200:**
```json
{
  "success": true
}
```

---

## WebSocket Events

### Autenticación de Canal
**Endpoint:** `POST /broadcasting/auth`
**Headers:** `X-CSRF-TOKEN`
**Body:**
```json
{
  "channel_name": "private-chat.4"
}
```

### Eventos Broadcast

#### message.sent
Se dispara cuando se envía un mensaje

**Canal:** `private-chat.{userId}`
**Payload:**
```json
{
  "id": 27,
  "sender_id": 1,
  "receiver_id": 4,
  "message": "Hola",
  "created_at": "2024-01-15T14:30:00.000000Z",
  "sender": {
    "id": 1,
    "name": "Admin RRHH",
    "email": "admin@empresa.com"
  }
}
```

---

## User - Empleado

### GET /dashboard
Dashboard del empleado autenticado

### GET /fichajes
Página de fichajes del empleado

### POST /fichajes/entrada
Registrar entrada

**Response 302:** Redirect con flash message

### POST /fichajes/salida
Registrar salida

**Response 302:** Redirect con flash message

### GET /mis-nominas
Listar nóminas del empleado

### POST /mis-nominas/verificar-password
Verificar contraseña antes de descargar

**Body:**
```json
{
  "password": "mi_password"
}
```

**Response 200:**
```json
{
  "valid": true
}
```

### GET /mis-nominas/{id}/descargar
Descargar PDF de nómina (requiere verificación previa)

**Response:** PDF file download

---

## Códigos de Estado

- **200 OK:** Solicitud exitosa
- **302 Found:** Redirect (típico en forms Inertia)
- **401 Unauthorized:** No autenticado
- **403 Forbidden:** No autorizado (no es admin)
- **404 Not Found:** Recurso no encontrado
- **422 Unprocessable Entity:** Errores de validación
- **500 Internal Server Error:** Error del servidor

## Rate Limiting

Todas las rutas API están limitadas a:
- 60 requests/minuto para usuarios autenticados
- 10 requests/minuto para login

---

Ver `docs/admin/01-guia-usuario.md` para ejemplos de uso desde la interfaz.
