# Documentación Técnica - Sistema de Administración

## Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Backend - Laravel](#backend---laravel)
4. [Frontend - React + TypeScript](#frontend---react--typescript)
5. [WebSockets en Tiempo Real](#websockets-en-tiempo-real)
6. [Base de Datos](#base-de-datos)
7. [Seguridad](#seguridad)
8. [Testing](#testing)

---

## Stack Tecnológico

### Backend
- **Framework:** Laravel 12.0
- **Lenguaje:** PHP 8.2+
- **ORM:** Eloquent
- **Autenticación:** Laravel Breeze
- **WebSockets:** Laravel Reverb
- **Broadcast:** Reverb (protocolo WebSocket)

### Frontend
- **Framework:** React 18.2
- **Lenguaje:** TypeScript 5.9.2
- **Routing:** Inertia.js 2.0
- **Estilos:** Tailwind CSS 3.2
- **Build Tool:** Vite 7.0
- **UI Components:** Headless UI 2.0
- **Icons:** Lucide React

### Base de Datos
- **Motor:** MySQL
- **Puerto:** 3307 (configurado en .env)
- **Charset:** utf8mb4

### Herramientas de Desarrollo
- **Linter:** ESLint 9.15 (flat config)
- **Formatter:** Prettier
- **Testing:** Vitest (frontend), PHPUnit (backend)
- **Package Manager:** Composer (backend), npm (frontend)

---

## Arquitectura del Sistema

### Patrón MVC con Service Layer

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Inertia   │ (SPA Routing)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Controller │ (HTTP Layer)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │ (Business Logic)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Model    │ (Data Access)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Database  │
└─────────────┘
```

### Separación de Responsabilidades

**Controllers:** Reciben requests, delegan lógica, retornan responses
**Services:** Contienen toda la lógica de negocio
**Models:** Representan entidades y scopes de base de datos
**Events:** Broadcasting de cambios en tiempo real

---

## Backend - Laravel

### Estructura de Carpetas

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/           # Controladores admin
│   │   ├── User/            # Controladores empleados
│   │   ├── Shared/          # Controladores compartidos (MessageController)
│   │   └── Auth/            # Autenticación Laravel Breeze
│   └── Middleware/
│       ├── HandleInertiaRequests.php
│       └── IsAdmin.php      # Middleware custom para admin
├── Models/
│   ├── User.php            # Usuario (admin o empleado)
│   ├── Empleado.php        # Información detallada del empleado
│   ├── Fichaje.php         # Registro de entrada/salida
│   ├── Nomina.php          # Archivo y datos de nómina
│   ├── Message.php         # Mensajes de chat
│   └── Contrato.php        # Información contractual
├── Services/
│   ├── Admin/              # Servicios de lógica admin
│   ├── User/               # Servicios de lógica empleado
│   └── Shared/             # Servicios compartidos (MessageService)
└── Events/
    └── MessageSent.php     # Evento WebSocket de mensaje
```

### Controladores Admin

#### DashboardController
**Ruta:** `GET /admin/dashboard`
**Responsabilidad:** Mostrar métricas y KPIs del dashboard

```php
public function index(Request $request)
{
    $mes = $request->get('mes', now()->month);
    $año = $request->get('año', now()->year);

    return Inertia::render('Admin/Dashboard', [
        'empleados' => Empleado::all(),
        'totalEmpleados' => Empleado::count(),
        'empleadosActivos' => Empleado::where('activo', true)->count(),
        // ... más métricas
    ]);
}
```

#### EmpleadoController
**CRUD completo** de empleados
- `index()`: Lista con filtros, búsqueda y paginación
- `create()`: Formulario de creación
- `store()`: Validación y guardado
- `edit()`: Formulario de edición
- `update()`: Actualización con validación
- `destroy()`: Eliminación con confirmación

**Delegación a Service:**
```php
public function store(Request $request)
{
    $datos = $request->validate(
        $this->empleadoService->getValidationRules(),
        $this->empleadoService->getValidationMessages()
    );

    $empleado = $this->empleadoService->crearEmpleado($datos);

    return redirect()->route('empleados.index')
        ->with('success', 'Empleado creado exitosamente');
}
```

#### NominaController
**Gestión de archivos PDF y datos salariales**
- `index()`: Lista de nóminas con filtros
- `subir()`: Subir nómina individual
- `subirMasivo()`: Subir múltiples nóminas
- `actualizar()`: Editar datos salariales
- `eliminar()`: Borrar nómina

**Manejo de archivos:**
```php
public function subir(Request $request)
{
    $archivo = $request->file('archivo');
    $path = $archivo->store('nominas', 'local');

    Nomina::create([
        'empleado_id' => $request->empleado_id,
        'mes' => $request->mes,
        'año' => $request->año,
        'archivo_ruta' => $path,
        'salario_bruto' => $request->salario_bruto,
        'salario_neto' => $request->salario_neto,
    ]);
}
```

### Services Layer

#### EmpleadoService
**Lógica de negocio de empleados**

```php
namespace App\Services\Admin;

class EmpleadoService
{
    public function crearEmpleado(array $datos): Empleado
    {
        // Crear usuario asociado
        $user = User::create([
            'name' => $datos['nombre'],
            'email' => $datos['email'],
            'password' => Hash::make('temporal123'),
        ]);

        // Asignar rol de empleado
        $user->assignRole('empleado');

        // Crear empleado
        return Empleado::create([
            'user_id' => $user->id,
            'nombre' => $datos['nombre'],
            // ... resto de campos
        ]);
    }

    public function getValidationRules(?int $empleadoId = null): array
    {
        return [
            'nombre' => 'required|string|min:3',
            'email' => 'required|email|unique:empleados,email,' . $empleadoId,
            'dni' => 'required|regex:/^[0-9]{8}[A-Z]$/|unique:empleados,dni,' . $empleadoId,
            'salario' => 'required|numeric|min:0',
            // ... más reglas
        ];
    }
}
```

#### MessageService
**Lógica de chat en tiempo real**

```php
namespace App\Services\Shared;

class MessageService
{
    public function sendMessage(User $sender, int $receiverId, string $messageText): array
    {
        // Crear mensaje
        $message = Message::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiverId,
            'message' => $messageText,
        ]);

        $message->load('sender');

        // Disparar evento WebSocket (broadcast inmediato)
        broadcast(new MessageSent($message))->toOthers();

        return [
            'id' => $message->id,
            'mensaje' => $message->message,
            'hora' => $message->created_at->format('H:i'),
            'esPropio' => true,
        ];
    }

    public function getConversationsForUser(User $user): array
    {
        if ($this->isAdmin($user)) {
            return $this->getAdminConversations($admin);
        }

        return $this->getEmployeeConversations($user, $admin);
    }
}
```

### Modelos Eloquent

#### Empleado
**Scopes útiles:**
```php
// Filtrar empleados activos
public function scopeActivo($query)
{
    return $query->where('activo', true);
}

// Filtrar por departamento
public function scopeDepartamento($query, string $departamento)
{
    return $query->where('departamento', $departamento);
}
```

**Relaciones:**
```php
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

public function fichajes(): HasMany
{
    return $this->hasMany(Fichaje::class);
}

public function nominas(): HasMany
{
    return $this->hasMany(Nomina::class);
}
```

#### Message
**Scopes para chat:**
```php
// Conversación entre dos usuarios
public function scopeConversation($query, int $adminId, int $empleadoId)
{
    return $query->where(function ($q) use ($adminId, $empleadoId) {
        $q->where('sender_id', $adminId)->where('receiver_id', $empleadoId);
    })->orWhere(function ($q) use ($adminId, $empleadoId) {
        $q->where('sender_id', $empleadoId)->where('receiver_id', $adminId);
    })->orderBy('created_at', 'asc');
}

// Mensajes no leídos
public function scopeUnreadFor($query, int $userId)
{
    return $query->where('receiver_id', $userId)->where('is_read', false);
}
```

---

## Frontend - React + TypeScript

### Estructura de Componentes

```
resources/js/
├── Components/
│   ├── Admin/              # Componentes solo para admin
│   │   ├── Dashboard/      # 8 componentes de dashboard
│   │   ├── Empleados/      # 8 componentes CRUD empleados
│   │   ├── Fichajes/       # 4 componentes fichajes
│   │   ├── Nominas/        # 8 componentes nóminas
│   │   └── Chat/           # 4 componentes chat admin
│   ├── User/               # Componentes solo para empleados
│   │   ├── Dashboard/      # Dashboard empleado
│   │   ├── Fichajes/       # Fichaje empleado
│   │   └── Chat/           # Chat empleado
│   └── Shared/             # Componentes reutilizables
│       ├── Common/         # Botones, inputs, modals
│       ├── Layout/         # Navbar, logo, dropdown
│       ├── Chat/           # Burbujas, input mensaje
│       └── Auth/           # Login components
├── Hooks/
│   ├── useChat.ts          # Lógica de chat y WebSockets
│   ├── useMetricas.ts      # Cálculos de dashboard
│   ├── useDepartamentos.ts # Análisis departamental
│   └── usePeriodos.ts      # Gestión de filtros temporales
├── Pages/
│   ├── Admin/              # Páginas completas admin
│   └── User/               # Páginas completas empleado
└── Layouts/
    ├── AuthenticatedLayout.tsx  # Layout principal
    └── GuestLayout.tsx          # Layout login
```

### Hooks Personalizados

#### useChat.ts
**Gestión completa del sistema de mensajería**

```typescript
export default function useChat(): UseChatReturn {
    const [mensajes, setMensajes] = useState<Mensaje[]>([]);
    const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
    const [mensajesNoLeidos, setMensajesNoLeidos] = useState<number>(0);

    // Cargar conversaciones
    const cargarConversaciones = useCallback(async () => {
        const response = await window.axios.get('/api/messages/conversations');
        setConversaciones(response.data);
    }, []);

    // Suscribirse a WebSocket
    const suscribirseAMensajes = useCallback(() => {
        window.Echo.private(`chat.${userId}`)
            .listen('.message.sent', (event: any) => {
                const nuevoMensaje: Mensaje = {
                    id: event.id,
                    mensaje: event.message,
                    hora: new Date(event.created_at).toLocaleTimeString('es-ES'),
                    esPropio: false,
                };

                setMensajes((prev) => [...prev, nuevoMensaje]);
                setMensajesNoLeidos((prev) => prev + 1);
                cargarConversaciones();
            });
    }, [userId]);

    return {
        mensajes,
        conversaciones,
        mensajesNoLeidos,
        cargarConversaciones,
        enviarMensaje,
        suscribirseAMensajes,
    };
}
```

#### useMetricas.ts
**Optimización de cálculos con useMemo**

```typescript
export default function useMetricas(empleados: Empleado[], mes: number, año: number) {
    // Cálculos memoizados (solo se recalculan si cambian las dependencias)
    const totalEmpleados = useMemo(() => empleados.length, [empleados]);

    const empleadosActivos = useMemo(
        () => empleados.filter(e => e.activo).length,
        [empleados]
    );

    const promedioSalarial = useMemo(() => {
        const suma = empleados.reduce((acc, e) => acc + parseFloat(e.salario), 0);
        return suma / empleados.length;
    }, [empleados]);

    const ratioRetencion = useMemo(
        () => (empleadosActivos / totalEmpleados) * 100,
        [empleadosActivos, totalEmpleados]
    );

    return {
        totalEmpleados,
        empleadosActivos,
        promedioSalarial,
        ratioRetencion,
    };
}
```

### Componentes Principales

#### Dashboard Admin
**Componente modular con hooks optimizados**

```typescript
export default function Dashboard({ empleados }: DashboardProps) {
    const [mes, setMes] = useState(now().month);
    const [año, setAño] = useState(now().year);

    const {
        totalEmpleados,
        empleadosActivos,
        promedioSalarial,
        ratioRetencion
    } = useMetricas(empleados, mes, año);

    const { departamentoLider } = useDepartamentos(empleados);

    return (
        <AuthenticatedLayout>
            <HeaderConFiltros mes={mes} año={año} onChangeMes={setMes} onChangeAño={setAño} />
            <MetricasPrincipales {...} />
            <MetricasSecundarias {...} />
            <SeccionDepartamentos {...} />
            <UltimosFichajes {...} />
        </AuthenticatedLayout>
    );
}
```

#### ListaEmpleados
**Tabla con filtros avanzados**

```typescript
export default function ListaEmpleados({ empleados, filtros }: Props) {
    // Aplicar filtros del lado del cliente
    const empleadosFiltrados = useMemo(() => {
        return empleados.filter(empleado => {
            // Búsqueda por texto
            if (filtros.busqueda && !empleado.nombre.includes(filtros.busqueda)) {
                return false;
            }

            // Filtro por departamento
            if (filtros.departamento && empleado.departamento !== filtros.departamento) {
                return false;
            }

            // Filtro por estado
            if (filtros.estado !== undefined && empleado.activo !== filtros.estado) {
                return false;
            }

            return true;
        });
    }, [empleados, filtros]);

    return (
        <div>
            {empleadosFiltrados.map(empleado => (
                <TarjetaEmpleado key={empleado.id} empleado={empleado} />
            ))}
        </div>
    );
}
```

### TypeScript - Tipos e Interfaces

#### Tipos de Props
```typescript
interface DashboardProps {
    empleados: Empleado[];
    totalEmpleados: number;
    empleadosActivos: number;
    contratacionesMes: number;
    promedioSalarial: number;
}

interface Empleado {
    id: number;
    nombre: string;
    email: string;
    dni: string;
    telefono: string;
    departamento: string;
    puesto: string;
    salario: string;
    fecha_contratacion: string;
    activo: boolean;
}

interface Mensaje {
    id: number;
    mensaje: string;
    hora: string;
    esPropio: boolean;
    nombreRemitente?: string;
}
```

### Manejo de Estado

**Inertia.js** maneja el estado global:
```typescript
import { useForm } from '@inertiajs/react';

const { data, setData, post, processing, errors } = useForm({
    nombre: '',
    email: '',
    salario: '',
});

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.empleados.store'));
};
```

---

## WebSockets en Tiempo Real

### Configuración Laravel Reverb

**`.env`:**
```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=830431
REVERB_APP_KEY=lmyx0x3n3nsgdipghlpc
REVERB_APP_SECRET=xzvjscdbja2jvvudqfxs
REVERB_HOST="localhost"
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

### Broadcasting Events

#### MessageSent Event
```php
namespace App\Events;

use App\Models\Message;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

class MessageSent implements ShouldBroadcastNow
{
    public Message $message;

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('chat.' . $this->message->receiver_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'sender_id' => $this->message->sender_id,
            'message' => $this->message->message,
            'created_at' => $this->message->created_at->toIso8601String(),
            'sender' => [
                'id' => $this->message->sender->id,
                'name' => $this->message->sender->name,
            ],
        ];
    }
}
```

**ShouldBroadcastNow:** Dispara el evento inmediatamente (no va a cola)

### Canales Privados

**`routes/channels.php`:**
```php
Broadcast::channel('chat.{userId}', function ($user, $userId) {
    // Solo el usuario puede suscribirse a su propio canal
    if ((int) $user->id === (int) $userId) {
        return ['id' => $user->id, 'name' => $user->name];
    }

    return false;
});
```

### Frontend - Echo Configuration

**`resources/js/bootstrap.js`:**
```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
    },
});
```

### Listening to Events

**En React (useChat hook):**
```typescript
window.Echo.private(`chat.${userId}`)
    .listen('.message.sent', (event: any) => {
        const nuevoMensaje = {
            id: event.id,
            mensaje: event.message,
            hora: new Date(event.created_at).toLocaleTimeString(),
            esPropio: false,
        };

        setMensajes(prev => [...prev, nuevoMensaje]);
    });
```

---

## Base de Datos

### Diagrama ER Simplificado

```
┌──────────┐         ┌───────────┐         ┌─────────┐
│  Users   │1      1 │  Empleado │1      * │ Fichaje │
│          ├─────────┤           ├─────────┤         │
│  - id    │         │  - id     │         │  - id   │
│  - name  │         │  - nombre │         │  - fecha│
│  - email │         │  - dni    │         │  - hora │
│  - pass  │         │  - salario│         │  - tipo │
└──────────┘         └─────┬─────┘         └─────────┘
                           │
                           │1
                           │
                           │*
                     ┌─────────┐
                     │ Nomina  │
                     │         │
                     │  - id   │
                     │  - mes  │
                     │  - año  │
                     │  - PDF  │
                     └─────────┘

┌──────────┐         ┌──────────┐
│  Message │*      1 │  Users   │
│          ├─────────┤          │
│  - id    │         │  (sender)│
│  - text  │         │          │
│  - read  │         └──────────┘
└────┬─────┘
     │*
     │
     │1
┌──────────┐
│  Users   │
│(receiver)│
│          │
└──────────┘
```

### Migraciones Principales

#### create_empleados_table
```php
Schema::create('empleados', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('nombre');
    $table->string('email')->unique();
    $table->string('dni', 9)->unique();
    $table->string('telefono');
    $table->date('fecha_nacimiento');
    $table->text('direccion');
    $table->date('fecha_contratacion');
    $table->string('departamento');
    $table->string('puesto');
    $table->decimal('salario', 10, 2);
    $table->boolean('activo')->default(true);
    $table->text('notas')->nullable();
    $table->timestamps();
});
```

#### create_fichajes_table
```php
Schema::create('fichajes', function (Blueprint $table) {
    $table->id();
    $table->foreignId('empleado_id')->constrained()->onDelete('cascade');
    $table->date('fecha');
    $table->time('hora');
    $table->enum('tipo', ['entrada', 'salida']);
    $table->timestamps();

    $table->index(['empleado_id', 'fecha']);
});
```

#### create_messages_table
```php
Schema::create('messages', function (Blueprint $table) {
    $table->id();
    $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
    $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
    $table->text('message');
    $table->boolean('is_read')->default(false);
    $table->timestamp('read_at')->nullable();
    $table->timestamps();

    $table->index(['sender_id', 'receiver_id']);
    $table->index(['receiver_id', 'is_read']);
});
```

---

## Seguridad

### Autenticación
- Laravel Breeze con sesiones
- Middleware `auth` en todas las rutas protegidas
- CSRF token en todos los formularios

### Autorización
- Middleware `admin` custom
- Verificación por email (admin@empresa.com)
- Separación de rutas admin/empleado

### Validación
- Form Requests con reglas estrictas
- Sanitización de inputs
- Validación tanto en backend como frontend

### Protección de Archivos
- Nóminas almacenadas en `storage/app` (no público)
- URLs temporales firmadas para descarga
- Verificación de ownership antes de descargar

---

## Testing

### Backend - PHPUnit
```bash
php artisan test
```

**Tests existentes:**
- Feature tests de endpoints
- Unit tests de services
- Tests de modelos y scopes

### Frontend - Vitest
```bash
npm test
```

**Cobertura actual:**
- 47 tests implementados
- 95%+ code coverage
- Tests de componentes con @testing-library/react
- Tests de hooks custom

**Ejemplo de test:**
```typescript
import { render, screen } from '@testing-library/react';
import MetricCard from '@/Components/Admin/Dashboard/MetricCard';

test('renders metric card with correct value', () => {
    render(<MetricCard titulo="Empleados" valor={100} />);
    expect(screen.getByText('Empleados')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
});
```

---

## Comandos Útiles

### Desarrollo
```bash
# Iniciar todos los servicios
composer run dev  # Laravel + Vite + Reverb + Queue

# O por separado:
php artisan serve        # Backend en :8000
npm run dev             # Frontend en :5174
php artisan reverb:start # WebSocket en :8080
php artisan queue:listen # Worker para jobs
```

### Producción
```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Base de Datos
```bash
php artisan migrate:fresh --seed  # Resetear con datos de prueba
php artisan migrate              # Solo migraciones
```

---

## Próximos Pasos / Roadmap

Ver `docs/admin/03-arquitectura.md` para detalles de arquitectura avanzada.
Ver `docs/admin/04-api-reference.md` para referencia completa de endpoints.
