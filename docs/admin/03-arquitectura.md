# Arquitectura del Sistema RRHH

## Principios de Diseño

### SOLID
- **Single Responsibility:** Cada clase tiene una única responsabilidad
- **Service Layer:** Controllers delegan lógica a Services
- **Dependency Injection:** Laravel IoC Container

### Separación de Concerns
```
Controllers → Services → Models → Database
     ↓           ↓
  HTTP Layer  Business Logic
```

## Estructura de Código

### Backend

#### Controllers
**Responsabilidad:** HTTP Request/Response
**Ubicación:** `app/Http/Controllers/{Admin|User|Shared}/`
**No contienen:** Lógica de negocio (está en Services)

#### Services
**Responsabilidad:** Lógica de negocio
**Ubicación:** `app/Services/{Admin|User|Shared}/`
**Contienen:** Validaciones, cálculos, operaciones complejas

#### Models
**Responsabilidad:** Representación de datos y ORM
**Ubicación:** `app/Models/`
**Contienen:** Scopes, relaciones, accessors/mutators

### Frontend

#### Arquitectura por Funcionalidad
```
Components/
├── Admin/          # Solo admin
├── User/           # Solo empleado
└── Shared/         # Compartidos
```

#### Hooks Custom
- `useChat`: WebSockets y mensajería
- `useMetricas`: Cálculos dashboard
- `useDepartamentos`: Análisis departamental
- `usePeriodos`: Filtros temporales

#### Optimizaciones React
- `useMemo`: Para cálculos pesados
- `useCallback`: Para funciones estables
- `React.memo`: Para componentes puros

## Flujos Principales

### Autenticación
```
1. Usuario → Login Form
2. POST /login
3. Laravel Breeze valida
4. Crea sesión
5. Redirect → Dashboard (admin o empleado)
```

### CRUD Empleados
```
1. Admin → GET /admin/empleados
2. EmpleadoController@index
3. EmpleadoService→getEmpleadosFiltrados()
4. Empleado Model → Query BD
5. Inertia → Render React
6. Muestra tabla con datos
```

### Chat en Tiempo Real
```
1. Empleado escribe mensaje
2. POST /api/messages/send
3. MessageController→sendMessage()
4. MessageService crea mensaje en BD
5. Dispara MessageSent Event
6. Reverb broadcast a canal privado
7. Admin recibe vía WebSocket
8. useChat hook actualiza UI
```

## WebSockets Flow Detallado

```
┌──────────┐                    ┌──────────┐
│ Empleado │                    │  Admin   │
└────┬─────┘                    └────┬─────┘
     │                               │
     │ 1. Escribe mensaje            │
     │                               │
     ▼                               │
┌─────────────────┐                 │
│ POST /api/send  │                 │
└────┬────────────┘                 │
     │                               │
     ▼                               │
┌──────────────────┐                │
│ MessageService   │                │
│ ─ Crea en BD     │                │
│ ─ Broadcast()    │                │
└────┬─────────────┘                │
     │                               │
     ▼                               │
┌──────────────────┐                │
│ MessageSent      │                │
│ Event            │                │
└────┬─────────────┘                │
     │                               │
     ▼                               │
┌──────────────────┐                │
│ Laravel Reverb   │                │
│ WebSocket Server │                │
└────┬─────────────┘                │
     │                               │
     │ WebSocket Push                │
     └───────────────────────────────▶
                                     │
                                     ▼
                            ┌────────────────┐
                            │ Echo.listen()  │
                            │ useChat hook   │
                            └────┬───────────┘
                                 │
                                 ▼
                            ┌────────────────┐
                            │ setMensajes()  │
                            │ UI Update      │
                            └────────────────┘
```

## Patrones de Diseño Implementados

### Repository Pattern (Parcial)
Services actúan como repositorios de lógica de negocio

### Observer Pattern
Laravel Events & Listeners para WebSockets

### Factory Pattern
Laravel usa factories en testing y seeders

### Strategy Pattern
Diferentes estrategias de validación según el contexto (crear vs editar)

## Performance

### Backend
- Eager Loading con `->with()` para evitar N+1
- Scopes reutilizables en modelos
- Cache de configuración en producción

### Frontend
- Code splitting con Vite
- Lazy loading de componentes
- Memoización de cálculos pesados
- Virtual scrolling (pendiente para listas largas)

## Escalabilidad

### Horizontal Scaling
- Stateless application (sesiones en BD)
- Queue workers separables
- Reverb en servidor dedicado

### Vertical Scaling
- Índices en BD para queries frecuentes
- Paginación en listados
- Caching estratégico

## Seguridad

### OWASP Top 10
✅ Injection: Eloquent ORM protege
✅ Authentication: Laravel Breeze
✅ XSS: Blade/React escapan por defecto
✅ CSRF: Token en todos los forms
✅ Broken Access: Middleware admin
✅ Security Misconfiguration: .env.example

## Monitoreo

### Logs
- Laravel Log: `storage/logs/laravel.log`
- Nivel configurable en `.env`

### Debugging
- Laravel Telescope (opcional)
- React DevTools
- Vite HMR para desarrollo

## Deployment

### Checklist Producción
```bash
# 1. Compilar assets
npm run build

# 2. Optimizar Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Migraciones
php artisan migrate --force

# 4. Permisos
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 5. Servicios
php artisan reverb:start &
php artisan queue:work &
```

### Variables de Entorno Producción
```env
APP_ENV=production
APP_DEBUG=false
BROADCAST_CONNECTION=reverb
QUEUE_CONNECTION=database
```

---

Ver `docs/admin/04-api-reference.md` para endpoints detallados.
