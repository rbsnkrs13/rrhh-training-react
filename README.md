# 📚 Sistema RRHH - Proyecto de Aprendizaje Full Stack

> Proyecto educativo enfocado en aprender desarrollo full stack moderno con Laravel, React y TypeScript. Implementa un sistema completo de gestión de Recursos Humanos con arquitectura profesional y mejores prácticas.

## 🎯 Objetivo del Proyecto

Sistema completo de gestión de RRHH construido para **aprender haciendo**. Cubre desde arquitectura backend limpia hasta interfaces React optimizadas, pasando por WebSockets, testing y TypeScript.

### Stack Tecnológico

**Backend:**
- Laravel 12 (Eloquent ORM, migrations, seeders)
- PHP 8.2+
- MySQL 8.0
- Laravel Breeze (autenticación)

**Frontend:**
- React 18 + TypeScript
- Inertia.js 2.0 (SPA sin APIs REST)
- Tailwind CSS 3
- Vite 7 (build tool)
- Vitest (testing, 47 tests con 95%+ coverage)

**Herramientas:**
- ESLint 9 (flat config moderno)
- Prettier (formateo automático)
- Headless UI (componentes accesibles)

---

## 🚀 Instalación Rápida

```bash
# 1. Clonar e instalar dependencias
git clone <repo-url>
composer install
npm install

# 2. Configurar entorno
cp .env.example .env
php artisan key:generate

# 3. Base de datos
php artisan migrate:fresh --seed

# 4. Levantar servidores (dos terminales)
npm run dev          # Frontend
php artisan serve    # Backend

# Acceso: http://localhost:8000
# Admin: admin@empresa.com / password
# Empleado: cualquier otro del seeder / password
```

---

## 📖 Conceptos y Patrones Implementados

### 1️⃣ **Arquitectura Modular (Separación por Funcionalidad)**

Estructura organizada por roles y responsabilidades:

```
Components/
├── Admin/              # 28 componentes exclusivos admin
│   ├── Dashboard/      # Métricas, KPIs, gráficos
│   ├── Empleados/      # CRUD completo con filtros
│   ├── Fichajes/       # Gestión de fichajes
│   ├── Nominas/        # Subida/gestión nóminas
│   └── Chat/           # Sistema mensajería admin
├── User/               # 10 componentes empleados
│   ├── Dashboard/      # Vista personal
│   ├── Fichajes/       # Fichaje entrada/salida
│   └── Chat/           # Chat con administración
└── Shared/             # 20 componentes reutilizables
    ├── Auth/           # Login, inputs
    ├── Common/         # Botones, modales
    ├── Layout/         # Navegación, logos
    └── Chat/           # Burbujas, headers, inputs
```

**Patrón aprendido:** Separar por funcionalidad (no por tipo de archivo) mejora la escalabilidad y mantenibilidad.

---

### 2️⃣ **TypeScript + React (Type Safety Completo)**

Migración completa a TypeScript con configuración estricta:

```typescript
// Definición de tipos centralizados
interface Empleado {
    id: number;
    nombre: string;
    email: string;
    departamento: 'IT' | 'RRHH' | 'Ventas' | 'Marketing';
    salario: number | null;
    activo: boolean;
}

// Props con tipos estrictos
interface MetricCardProps {
    titulo: string;
    valor: string | number;
    color?: 'blue' | 'green' | 'yellow' | 'red';
    descripcion?: string;
}
```

**Archivos clave:**
- `tsconfig.json` - Configuración strict mode
- `resources/js/types/index.ts` - Todas las interfaces
- `vite.config.ts` - Build con soporte completo TS

---

### 3️⃣ **Hooks Avanzados de React**

#### Custom Hooks para Lógica Reutilizable

**`useMetricas.ts`** - Optimización con useMemo
```typescript
export function useMetricas(empleados: Empleado[], mes: number, año: number) {
    const metricas = useMemo(() => {
        // Solo recalcula si cambian las dependencias
        const activos = empleados.filter(e => e.activo);
        const contratadosMes = empleados.filter(e =>
            new Date(e.fecha_contratacion).getMonth() === mes
        );

        return {
            totalEmpleados: empleados.length,
            empleadosActivos: activos.length,
            empleadosContratadosMes: contratadosMes.length,
            promedioSalarial: calcularPromedio(activos)
        };
    }, [empleados, mes, año]);

    return metricas;
}
```

**`usePeriodos.ts`** - useCallback para funciones optimizadas
```typescript
export function usePeriodos() {
    const [mes, setMes] = useState(new Date().getMonth());

    const cambiarMes = useCallback((nuevoMes: number) => {
        setMes(nuevoMes);
    }, []);

    return { mes, cambiarMes };
}
```

**Concepto clave:** useMemo/useCallback previenen renders innecesarios en componentes con cálculos pesados.

---

### 4️⃣ **Arquitectura Backend: Controllers + Services**

Separación de responsabilidades para código mantenible:

```php
// Controller - Solo maneja HTTP
class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $service
    ) {}

    public function index(): Response
    {
        $user = Auth::user();
        $datos = $this->service->obtenerDatosDashboard(
            $user->id,
            $user->email
        );

        return Inertia::render('Employee/EmpleadoDashboard', $datos);
    }
}

// Service - Lógica de negocio
class DashboardService
{
    public function obtenerDatosDashboard(int $userId, string $email): array
    {
        return [
            'fichajesRecientes' => $this->obtenerFichajesRecientes($userId),
            'nominasRecientes' => $this->obtenerNominasRecientes($userId),
            'estadoFichaje' => $this->calcularEstadoFichaje($userId),
            'horasSemana' => $this->calcularHorasSemana($userId, $email)
        ];
    }

    // Métodos privados con lógica específica...
}
```

**Estructura creada:**
- `app/Services/DashboardService.php`
- `app/Http/Controllers/User/DashboardController.php`
- `app/Http/Controllers/Admin/` (controllers especializados)

**Ventaja:** Services reutilizables en controllers, commands, jobs, etc.

---

### 5️⃣ **Sistema de Fichajes con Carbon**

Cálculo automático de horas trabajadas:

```php
// Modelo Fichaje.php
public static function calcularHorasDia(int $empleadoId, string $fecha): float
{
    $fichajes = self::where('empleado_id', $empleadoId)
        ->where('fecha', $fecha)
        ->orderBy('hora')
        ->get();

    $totalHoras = 0;
    $entradaAbierta = null;

    foreach ($fichajes as $fichaje) {
        if ($fichaje->tipo === 'entrada') {
            $entradaAbierta = Carbon::parse($fichaje->hora);
        } elseif ($entradaAbierta) {
            $salida = Carbon::parse($fichaje->hora);
            $totalHoras += $entradaAbierta->diffInMinutes($salida) / 60;
            $entradaAbierta = null;
        }
    }

    return round($totalHoras, 2);
}

public static function tieneEntradaAbierta(int $empleadoId, string $fecha): bool
{
    $ultimoFichaje = self::where('empleado_id', $empleadoId)
        ->where('fecha', $fecha)
        ->latest('hora')
        ->first();

    return $ultimoFichaje && $ultimoFichaje->tipo === 'entrada';
}
```

**Funcionalidad:**
- Dashboard empleado: botón "Fichar Entrada/Salida"
- Cálculo automático horas día/semana
- Historial con filtros y exportación CSV

---

### 6️⃣ **Gestión de Archivos (Nóminas)**

Upload masivo y descarga segura de PDFs:

```php
// Subida masiva
public function subirMasivo(Request $request)
{
    $request->validate([
        'archivos.*' => 'required|file|mimes:pdf|max:10240',
        'empleado_id' => 'required|exists:empleados,id'
    ]);

    foreach ($request->file('archivos') as $archivo) {
        $nombre = $archivo->getClientOriginalName();
        preg_match('/(\d{4})_(\d{2})/', $nombre, $matches);

        $ruta = $archivo->store('nominas', 'public');

        Nomina::create([
            'empleado_id' => $request->empleado_id,
            'año' => $matches[1] ?? date('Y'),
            'mes' => $matches[2] ?? date('m'),
            'archivo_ruta' => $ruta,
            'archivo_nombre' => $nombre
        ]);
    }
}

// Descarga segura con URLs temporales
public function descargar(Nomina $nomina)
{
    $this->authorize('view', $nomina); // Policy
    return Storage::disk('public')->download($nomina->archivo_ruta);
}
```

**Patrón aplicado:** Storage facade + validación + autorización

---

### 7️⃣ **Testing Automatizado (Vitest + React Testing Library)**

47 tests con 95%+ coverage:

```typescript
// BurbujaMensaje.test.tsx
describe('BurbujaMensaje', () => {
    it('renderiza mensaje propio con estilos correctos', () => {
        render(
            <BurbujaMensaje
                mensaje="Hola, necesito ayuda"
                hora="10:30"
                esPropio={true}
            />
        );

        const mensajeElement = screen.getByText('Hola, necesito ayuda');
        expect(mensajeElement).toBeInTheDocument();

        const horaElement = screen.getByText('10:30');
        expect(horaElement).toBeInTheDocument();
    });

    it('muestra nombre remitente para mensajes externos', () => {
        render(
            <BurbujaMensaje
                mensaje="Te respondo pronto"
                hora="10:35"
                esPropio={false}
                nombreRemitente="Administración"
            />
        );

        expect(screen.getByText('Administración')).toBeInTheDocument();
    });
});
```

**Comandos:**
```bash
npm test                    # Ejecutar tests
npm run test:coverage       # Reporte coverage
npm run test:ui             # Interfaz gráfica
```

---

### 8️⃣ **Sistema de Chat (UI Completa)**

#### Vista Empleado
- Botón flotante (esquina inferior derecha)
- Panel deslizable al hacer click
- Chat directo con administración

#### Vista Admin
- Botón flotante → redirect a `/admin/mensajes`
- Página completa con:
  - Sidebar: lista de conversaciones con búsqueda
  - Panel chat: conversación activa
  - Indicadores de mensajes no leídos

**Componentes creados:**
```
Chat/
├── Shared/
│   ├── BurbujaMensaje.tsx     # Burbujas con estilos según remitente
│   ├── InputMensaje.tsx       # Input con Enter para enviar
│   └── HeaderChat.tsx         # Header reutilizable
├── User/
│   ├── ChatButtonUser.tsx     # Botón flotante empleado
│   └── ChatPanel.tsx          # Panel deslizable
└── Admin/
    ├── ChatButtonAdmin.tsx    # Botón flotante admin
    ├── SidebarConversaciones.tsx
    ├── PanelConversacion.tsx
    └── ConversacionItem.tsx
```

**Estado actual:** UI completa y funcional
**Próximo paso:** Implementar backend con Laravel Reverb (WebSockets)

---

## 📂 Estructura del Proyecto

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/              # DashboardController, EmpleadoController, etc.
│   │   ├── User/               # DashboardController, FichajeController, etc.
│   │   └── Auth/               # AuthenticatedSessionController
│   └── Middleware/
│       └── IsAdmin.php         # Middleware autorización admin
├── Models/
│   ├── Empleado.php            # Con scopes y accessors
│   ├── Fichaje.php             # Cálculos automáticos con Carbon
│   ├── Nomina.php              # Gestión de archivos
│   └── Contrato.php            # Horas semanales, tipo contrato
└── Services/
    └── DashboardService.php    # Lógica de negocio separada

resources/js/
├── Components/                  # 58 componentes organizados
│   ├── Admin/                   # 28 componentes
│   ├── User/                    # 10 componentes
│   └── Shared/                  # 20 componentes
├── Hooks/                       # 3 custom hooks
│   ├── useMetricas.ts
│   ├── useDepartamentos.ts
│   └── usePeriodos.ts
├── Pages/                       # 15+ páginas Inertia
│   ├── Admin/
│   ├── Employee/
│   └── Auth/
├── Layouts/
│   ├── AuthenticatedLayout.tsx
│   └── GuestLayout.tsx
└── types/
    └── index.ts                 # Interfaces TypeScript centralizadas

database/
├── migrations/                  # Schema profesional
├── factories/                   # Datos realistas con Faker
└── seeders/                     # 50+ empleados de prueba
```

---

## ✨ Funcionalidades Implementadas

### ✅ Dashboard Admin
- Métricas KPIs (total empleados, activos, salario promedio, retención)
- Filtros dinámicos por mes/año
- Gráficos de distribución departamental
- Últimos fichajes en tiempo real
- Alertas automáticas por umbrales

### ✅ Gestión de Empleados
- CRUD completo con validación
- Formularios con estados de carga
- Filtros avanzados (búsqueda, departamento, estado)
- Ordenamiento dinámico
- Vista expandible tipo accordion
- Flash messages para feedback

### ✅ Sistema de Fichajes
- Dashboard admin (ver todos los fichajes)
- Vista empleado (botón fichar entrada/salida)
- Historial completo con filtros por fecha y empleado
- Exportación a CSV
- Cálculo automático de horas trabajadas (día/semana/mes)
- Indicador de estado actual (fichado/no fichado)

### ✅ Gestión de Nóminas
- Subida masiva de PDFs (admin)
- Descarga segura con autorización (empleado)
- Organización por empleado y período
- Visualización de datos (salario bruto/neto)
- Interface intuitiva para empleados

### ✅ Sistema de Mensajería
- UI completa para empleado (panel deslizable)
- UI completa para admin (página dedicada)
- Búsqueda de conversaciones
- Indicadores de mensajes no leídos
- Diseño responsive
- **Pendiente:** Backend con Laravel Reverb

---

## 🎓 Conceptos y Tecnologías Aprendidas

### React + TypeScript
- ✅ Hooks avanzados: useMemo, useCallback, useEffect
- ✅ Custom hooks para lógica reutilizable
- ✅ TypeScript: interfaces, tipos, genéricos
- ✅ Componentes funcionales optimizados
- ✅ Performance: memoización, lazy loading
- ✅ Testing: Vitest + React Testing Library

### Laravel Backend
- ✅ Arquitectura limpia: Controllers → Services
- ✅ Eloquent ORM: relaciones, scopes, accessors
- ✅ Validación robusta con Form Requests
- ✅ Storage: upload/download de archivos
- ✅ Middleware personalizado
- ✅ Policies para autorización
- ✅ Carbon para manejo de fechas/horas

### Inertia.js (SPA sin APIs)
- ✅ Server-side routing
- ✅ useForm hook para formularios
- ✅ Flash messages automáticos
- ✅ Links optimizados con prefetch
- ✅ Shared data entre páginas

### DevOps & Tooling
- ✅ ESLint 9 con flat config moderno
- ✅ Prettier para formateo consistente
- ✅ Vite con HMR (Hot Module Replacement)
- ✅ Testing automatizado con 95%+ coverage
- ✅ Git workflow con commits descriptivos
- ✅ TypeScript configuración estricta

---

## 🚧 Roadmap y Próximas Implementaciones

### En desarrollo:
1. **Laravel Reverb + WebSockets** - Chat en tiempo real
   - Configurar Broadcasting
   - Crear eventos y listeners
   - Integrar Laravel Echo en React
   - Notificaciones push

### Planificado:
2. **Sistema de Roles y Permisos** - Spatie Permission
3. **Exportación Avanzada** - PDFs y Excel (Laravel Excel)
4. **Error Boundaries** - Manejo robusto de errores React
5. **Dark Mode** - Toggle con persistencia en localStorage
6. **Notificaciones** - Sistema de alertas en tiempo real
7. **CI/CD** - GitHub Actions para testing y deploy automático
8. **Dockerización** - Entorno reproducible

---

## 🛠️ Comandos Útiles

### Desarrollo
```bash
composer run dev              # Backend + Frontend simultáneos
npm run dev                   # Solo frontend (Vite)
php artisan serve             # Solo backend (Laravel)
```

### Base de Datos
```bash
php artisan migrate:fresh --seed    # Resetear con datos de prueba
php artisan db:seed --class=EmpleadoSeeder
php artisan tinker                  # REPL interactivo
```

### Testing
```bash
npm test                      # React tests (Vitest)
npm run test:coverage         # Coverage report
npm run test:ui               # Interfaz gráfica
php artisan test              # Laravel tests (PHPUnit)
```

### Build Producción
```bash
npm run build                 # Compilar assets
php artisan optimize          # Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Linting y Formateo
```bash
npm run lint                  # ESLint check
npm run format               # Prettier format
```

---

## 💡 Decisiones de Arquitectura

### ¿Por qué Inertia.js en lugar de REST API?
- **Ventaja:** Desarrollo más rápido, menos boilerplate
- **Tradeoff:** No apto para APIs públicas o apps móviles
- **Uso ideal:** Aplicaciones web SPA con Laravel backend

### ¿Por qué TypeScript?
- **Ventaja:** Type safety, mejor DX, menos bugs en runtime
- **Tradeoff:** Curva de aprendizaje inicial
- **Beneficio:** Mantenibilidad a largo plazo

### ¿Por qué Services separados de Controllers?
- **Ventaja:** Controllers delgados, lógica testeable
- **Tradeoff:** Más archivos, más abstracción
- **Beneficio:** Reutilización en commands, jobs, tests

### ¿Por qué Vitest en lugar de Jest?
- **Ventaja:** Más rápido, mejor integración con Vite
- **Tradeoff:** Ecosistema más joven
- **Beneficio:** HMR en tests, misma config que build

---

## 📚 Recursos de Aprendizaje

### Documentación Oficial
- [Laravel 12](https://laravel.com/docs/12.x) - Framework backend
- [React](https://react.dev/) - Librería UI
- [Inertia.js](https://inertiajs.com/) - SPA adapter
- [TypeScript](https://www.typescriptlang.org/docs/) - Tipado estático
- [Vitest](https://vitest.dev/) - Testing framework
- [Tailwind CSS](https://tailwindcss.com/) - Estilos utility-first

### Guías y Tutoriales
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## 📄 Licencia

MIT License - Proyecto educativo de código abierto

---

⭐ **Si este proyecto te sirve para aprender, dale una estrella!**

💬 **Dudas o sugerencias?** Abre un issue - todos estamos aprendiendo.
