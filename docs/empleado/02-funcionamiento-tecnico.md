# Funcionamiento Técnico - Portal del Empleado

## Tecnologías que usas (sin saberlo)

### 🌐 Frontend - Lo que ves
**React 18 + TypeScript**
- La interfaz moderna y rápida que usas cada día
- Las páginas no recargan completamente, solo actualizan lo necesario
- Por eso todo se siente instantáneo

**Tailwind CSS**
- Los estilos bonitos y profesionales
- Diseño responsivo (funciona en móvil, tablet, desktop)

### 🔧 Backend - Lo que no ves
**Laravel 12**
- El "cerebro" que procesa todas tus solicitudes
- Valida tus datos y los guarda de forma segura
- Genera tus nóminas PDF y calcula tus horas

**MySQL**
- Base de datos donde se guardan:
  - Tus fichajes
  - Tu información personal
  - Tus nóminas
  - Mensajes del chat

### 🔒 Seguridad

**Autenticación Laravel Breeze**
- Tu sesión está cifrada
- Tu contraseña NUNCA se guarda en texto plano (usa bcrypt)
- Token de sesión único cada vez que inicias sesión

**CSRF Protection**
- Todos los formularios tienen protección contra ataques
- Tokens invisibles que validan cada acción

---

## Cómo funciona cada sección

### 📊 Dashboard

#### ¿Qué sucede cuando abres el dashboard?

```
1. Tu navegador pide la página a Laravel
2. Laravel verifica que estés autenticado
3. Consulta la base de datos:
   - Tus fichajes recientes
   - Tus nóminas disponibles
   - Horas trabajadas esta semana
   - Tu información personal
4. Renderiza la página con React
5. Recibes la vista en menos de 1 segundo
```

#### Cálculos automáticos

**Horas trabajadas:**
```
Entrada: 09:00
Salida: 18:00
Sistema calcula: 9 horas - 1 hora pausa = 8 horas trabajadas
```

**Barra de progreso semanal:**
```
40 horas objetivo
32 horas trabajadas
= 80% completado → Color amarillo
```

---

### ⏰ Sistema de Fichajes

#### ¿Cómo se registra un fichaje?

**Cuando fichás entrada:**
```
1. Presionas "Fichar Entrada"
2. JavaScript captura tu click
3. Envía petición POST a Laravel
4. Laravel verifica:
   ✓ Estás autenticado
   ✓ No tienes entrada abierta ya
5. Guarda en base de datos:
   - Tu ID de empleado
   - Fecha actual
   - Hora actual (Carbon PHP)
   - Tipo: "entrada"
6. Respuesta instantánea con confirmación
7. Dashboard se actualiza automáticamente
```

**Cuando fichás salida:**
```
1. Laravel busca tu última entrada abierta
2. Calcula automáticamente:
   Hora salida - Hora entrada = Horas trabajadas
3. Guarda el resultado en tu registro
4. Cierra el fichaje
5. Actualiza estadísticas del mes
```

#### Validaciones del sistema

**No puedes:**
- Fichar entrada dos veces seguidas
- Fichar salida sin haber fichado entrada
- Modificar tus propios fichajes (solo admin)

**Solución si olvidaste fichar:**
Contacta con Administración vía chat. Ellos tienen acceso para corregir manualmente tus registros.

---

### 💵 Mis Nóminas

#### ¿Por qué pide contraseña al descargar?

**Seguridad multicapa:**
```
1. Ya estás autenticado (primera capa)
2. Pero si alguien usa tu ordenador sin permiso...
3. La contraseña es una segunda verificación
4. Así protegemos tus datos salariales sensibles
```

#### Proceso de descarga

**Backend:**
```
1. Verificas tu contraseña
2. Laravel valida contra la BD (bcrypt)
3. Si es correcta:
   - Genera URL temporal (válida 5 minutos)
   - Lee el archivo PDF de storage
   - Envía el archivo encriptado
4. Tu navegador descarga el PDF
5. La URL temporal expira
```

**¿Por qué URL temporal?**
Nadie puede compartir un enlace directo a tu nómina. Cada descarga requiere autenticación fresca.

---

### 💬 Chat con Administración

#### Tecnología WebSocket (Tiempo Real)

**Antes: HTTP tradicional**
```
Tú: ¿Hay mensajes nuevos?
Servidor: No
(5 segundos después)
Tú: ¿Y ahora?
Servidor: No
(5 segundos después)
Tú: ¿Y ahora?
Servidor: Sí, 1 mensaje nuevo
```

**Ahora: WebSockets**
```
Tú: Me conecto al chat
Servidor: Conexión establecida, te aviso si hay novedades
(Admin envía mensaje)
Servidor: ¡PING! Mensaje nuevo, aquí está
(aparece instantáneamente)
```

#### ¿Cómo funciona?

**Laravel Reverb + Echo.js:**
```
1. Al cargar cualquier página, te conectas a WebSocket
2. Te suscribes a tu canal privado: chat.{tu_id}
3. Canal permanece abierto mientras navegas
4. Cuando Admin envía mensaje:
   - Laravel dispara evento MessageSent
   - Reverb lo envía por WebSocket
   - Echo.js lo recibe en tu navegador
   - React actualiza el chat
   - Badge de notificaciones se actualiza
5. Todo en <100ms
```

**Tu canal es privado:**
```php
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
```
Solo TÚ puedes escuchar mensajes de tu canal.

#### Indicador de mensajes no leídos

**Badge rojo en el botón:**
```
1. Mensaje nuevo llega vía WebSocket
2. useChat hook incrementa contador: +1
3. Badge se actualiza en tiempo real
4. Abres chat → Se marca como leído
5. Contador vuelve a 0
```

---

## Optimizaciones que disfrutas

### ⚡ Performance Frontend

**React Hooks optimizados:**
- `useMemo`: Calcula horas trabajadas solo cuando cambian tus fichajes
- `useCallback`: Funciones estables que no re-renderizan innecesariamente
- Virtual DOM: Solo actualiza lo que cambia en la pantalla

**Caché inteligente:**
- Tus datos se cachean temporalmente en el navegador
- Segunda visita a Dashboard → carga instantánea

### 🚀 Performance Backend

**Eloquent ORM:**
- Queries optimizadas automáticamente
- Prevención de N+1 problems
- Índices en columnas frecuentes (user_id, fecha)

**Eager Loading:**
```php
// Malo (N+1)
foreach ($fichajes as $fichaje) {
    echo $fichaje->empleado->nombre; // Query extra cada vez
}

// Bueno (Optimizado)
$fichajes = Fichaje::with('empleado')->get(); // 1 sola query
```

---

## Datos técnicos interesantes

### 📊 Bases de Datos

**Tabla: users**
```sql
- id: Tu identificador único
- name: Tu nombre completo
- email: Tu email (único)
- password: Hash bcrypt (irreversible)
- created_at: Fecha de registro
```

**Tabla: fichajes**
```sql
- id: ID del fichaje
- user_id: Tu ID
- fecha: YYYY-MM-DD
- hora: HH:MM:SS
- tipo: 'entrada' | 'salida'
- horas_trabajadas: Decimal calculado
```

**Tabla: nominas**
```sql
- id: ID nómina
- user_id: Tu ID
- mes: 1-12
- año: YYYY
- archivo: Ruta del PDF
- salario_bruto: Decimal
- salario_neto: Decimal
```

**Tabla: messages**
```sql
- id: ID mensaje
- sender_id: Quién envía
- receiver_id: Quién recibe
- message: Texto (max 5000 caracteres)
- is_read: Boolean
- created_at: Timestamp
```

### 🔐 Seguridad de Contraseña

**Tu contraseña "Password123" se guarda como:**
```
$2y$12$abcdefg... (60 caracteres)
```

**Imposible de descifrar:**
- Algoritmo bcrypt con salt único
- 2^12 rondas de hashing
- Ni siquiera Admin puede ver tu contraseña real

---

## APIs que usas

### Endpoints principales

**Fichajes:**
```
POST /fichajes/entrada
POST /fichajes/salida
GET /fichajes/historial
```

**Nóminas:**
```
GET /mis-nominas
POST /mis-nominas/verificar-password
GET /mis-nominas/{id}/descargar
```

**Chat:**
```
GET /api/messages/conversations
GET /api/messages/messages/{adminId}
POST /api/messages/send
GET /api/messages/unread-count
POST /api/messages/mark-read/{senderId}
```

### Rate Limiting

**Protección contra abuso:**
- Login: 10 intentos/minuto
- APIs: 60 requests/minuto
- Descargas: Sin límite (ya tienes segunda autenticación)

---

## Compatibilidad

### Navegadores soportados
✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

### Dispositivos
✅ Desktop (Windows, Mac, Linux)
✅ Tablets (iPad, Android)
✅ Móviles (iOS, Android)

### Requisitos mínimos
- Conexión a internet (WiFi o datos)
- JavaScript habilitado
- Cookies habilitadas

---

## Privacidad de tus datos

### ¿Quién puede ver qué?

**Tú:**
- ✅ Tus propios fichajes
- ✅ Tus propias nóminas
- ✅ Tu información personal
- ❌ Datos de otros empleados

**Admin:**
- ✅ Fichajes de todos
- ✅ Datos de todos los empleados
- ❌ Contraseñas (están hasheadas)
- ✅ Mensajes del chat (son soporte oficial)

**Base de datos:**
- Protegida con firewall
- Acceso solo desde servidor Laravel
- Backups encriptados

---

## Troubleshooting

### Chat no muestra mensajes nuevos

**Posibles causas:**
1. Conexión WebSocket caída
   - Solución: Refresca la página (F5)

2. Firewall bloqueando WebSockets
   - Solución: Contacta IT de tu empresa

3. Navegador bloqueando scripts
   - Solución: Habilita JavaScript

### Fichaje no se registra

**Checklist:**
1. ¿Estás autenticado? (Sesión activa)
2. ¿Ya tienes una entrada abierta? (No puedes fichar dos veces)
3. ¿Conexión a internet estable?
4. ¿Hora del sistema correcta? (El servidor valida timestamps)

### Nómina no descarga

**Razones comunes:**
1. Contraseña incorrecta → Verifica mayúsculas/minúsculas
2. Archivo no disponible aún → Espera hasta día 5 del mes
3. Popup bloqueado → Permite popups para este sitio

---

## ¿Preguntas?

Si algo de esto no funciona o tienes curiosidad técnica:

📧 **Email:** rrhh@tu-empresa.com
💬 **Chat en vivo:** Botón azul abajo a la derecha
📱 **Teléfono:** XXX XXX XXX (9-18h)

**Recuerda:** El chat es en tiempo real, úsalo para consultas rápidas.
