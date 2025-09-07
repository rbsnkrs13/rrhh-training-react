# 🎯 Sistema de Gestión de RRHH

Una aplicación web completa para la gestión de Recursos Humanos desarrollada con **Laravel 12**, **Inertia.js** y **React**. Proyecto de entrenamiento que implementa las mejores prácticas del desarrollo front-end moderno con arquitectura avanzada y hooks optimizados.

## ✨ Características Principales

### 🏢 Gestión de Empleados
- **CRUD completo** - Crear, leer, actualizar y eliminar empleados
- **Formularios avanzados** con validación en tiempo real
- **Vista expandible** tipo accordion para optimizar el espacio
- **Flash messages** para feedback inmediato
- **Validación robusta** tanto en frontend como backend

### 📊 Dashboard Profesional con Hooks Avanzados
- **Métricas en tiempo real** calculadas desde la base de datos
- **Filtros dinámicos** por mes y año con detección automática de períodos
- **Selects optimizados** con CSS personalizado y funcionalidad avanzada
- **Animaciones de carga** con useEffect optimizado
- **Alertas inteligentes** basadas en umbrales críticos
- **Arquitectura modular** con hooks personalizados

### 🔍 Filtros y Búsqueda Avanzada
- **Búsqueda en tiempo real** por nombre y email
- **Filtros multi-criterio** por departamento y estado
- **Ordenamiento dinámico** con múltiples opciones
- **Componente reutilizable** de filtros avanzados
- **Resumen de filtros activos** con indicadores visuales

### 🎨 UX/UI Moderna
- **Diseño responsive** optimizado para todos los dispositivos
- **Sistema de colores** dinámico para estados críticos
- **Loading states** con spinners y animaciones
- **Hover effects** y transiciones suaves
- **Componentes modulares** reutilizables

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 12 con Eloquent ORM
- **Frontend:** React 18 con hooks avanzados
- **State Management:** useState, useEffect, useMemo, useCallback
- **Routing:** Inertia.js para SPA sin APIs
- **Base de Datos:** MySQL 8.0 con migraciones profesionales
- **Estilos:** Tailwind CSS con componentes personalizados
- **Build Tool:** Vite con HMR
- **IDE:** VSCode optimizado

## 🏗️ Arquitectura del Proyecto

### Hooks Personalizados (Lógica de Negocio)
- **useMetricas:** Cálculos optimizados de métricas empresariales
- **useDepartamentos:** Gestión y análisis de departamentos
- **usePeriodos:** Manejo de filtros temporales dinámicos

### Componentes Modulares
```
Components/
├── Dashboard/
│   ├── HeaderConFiltros.jsx      # Filtros año/mes optimizados
│   ├── MetricasPrincipales.jsx   # KPIs principales
│   ├── MetricasSecundarias.jsx   # Métricas adicionales
│   └── SeccionDepartamentos.jsx  # Análisis departamental
├── MetricCard.jsx                # Tarjetas métricas reutilizables
├── FlashMessage.jsx              # Sistema de notificaciones
└── FiltroAvanzado.jsx           # Filtros multi-criterio
```

### Hooks Implementados
```
Hooks/
├── useMetricas.js               # useMemo para cálculos pesados
├── useDepartamentos.js          # Optimización de datos departamentales  
└── usePeriodos.js              # useCallback para funciones optimizadas
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- PHP 8.2+ con extensiones requeridas
- Composer 2.0+
- Node.js 18+ con npm
- MySQL 8.0+ o PostgreSQL 13+

### Instalación Paso a Paso

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/rbsnkrs13/rrhh-training.git
   cd rrhh-training
   ```

2. **Instalar dependencias del backend**
   ```bash
   composer install
   ```

3. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

4. **Configurar entorno**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. **Configurar base de datos**
   ```env
   DB_DATABASE=rrhh_training
   DB_USERNAME=tu_usuario
   DB_PASSWORD=tu_password
   ```

6. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Compilar assets y levantar servidores**
   ```bash
   # Terminal 1 - Frontend con HMR
   npm run dev
   
   # Terminal 2 - Backend Laravel
   php artisan serve
   ```

8. **Acceder a la aplicación**
   ```
   Frontend: http://localhost:8000
   Backend API: http://localhost:8000/api (si aplica)
   ```

## 📁 Estructura Detallada del Proyecto

```
rrhh-training/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── EmpleadoController.php    # CRUD completo
│   │   │   └── Auth/                      # Autenticación
│   │   └── Middleware/
│   │       └── HandleInertiaRequests.php # Configuración Inertia
│   └── Models/
│       └── Empleado.php                   # Modelo con scopes y accessors
├── database/
│   ├── migrations/
│   │   └── create_empleados_table.php     # Schema profesional
│   ├── factories/
│   │   └── EmpleadoFactory.php           # Datos realistas con timestamps
│   └── seeders/
│       └── EmpleadoSeeder.php            # Población de datos
├── resources/
│   ├── js/
│   │   ├── Hooks/                        # Hooks personalizados
│   │   │   ├── useMetricas.js           # useMemo optimizado
│   │   │   ├── useDepartamentos.js      # Análisis departamental
│   │   │   └── usePeriodos.js           # useCallback para períodos
│   │   ├── Components/
│   │   │   ├── Dashboard/               # Componentes modulares
│   │   │   ├── MetricCard.jsx          # Componente base
│   │   │   └── FiltroAvanzado.jsx      # Filtros reutilizables
│   │   ├── Pages/
│   │   │   ├── Dashboard.jsx           # Dashboard refactorizado
│   │   │   ├── Empleados.jsx           # Lista con filtros
│   │   │   ├── CrearEmpleado.jsx       # Formulario creación
│   │   │   └── EditarEmpleado.jsx      # Formulario edición
│   │   └── Layouts/
│   │       └── AuthenticatedLayout.jsx  # Layout principal
│   └── views/
│       └── app.blade.php               # Template base
└── routes/
    └── web.php                         # Rutas con middleware
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard Avanzado
- [x] **Métricas profesionales** - Total empleados, activos, contrataciones por período
- [x] **Filtros dinámicos** - Selección de año/mes con detección automática
- [x] **Cálculos optimizados** - useMemo para rendimiento en producción
- [x] **Animaciones de carga** - useEffect con cleanup automático
- [x] **Alertas inteligentes** - Notificaciones por umbrales críticos
- [x] **Distribución departamental** - Gráficos de barras responsive
- [x] **Lista de empleados recientes** - Vista optimizada con estado

### ✅ Gestión de Empleados
- [x] **CRUD completo** con validación en tiempo real
- [x] **Formularios avanzados** - Estados de carga y error handling
- [x] **Vista expandible** - Accordion optimizado para UX
- [x] **Eliminación con confirmación** - Modal de seguridad
- [x] **Flash messages** - Sistema de notificaciones contextual

### ✅ Sistema de Filtros
- [x] **Búsqueda en tiempo real** - Por nombre y email
- [x] **Filtros multi-criterio** - Departamento, estado, fecha
- [x] **Ordenamiento dinámico** - Múltiples criterios
- [x] **Componente reutilizable** - FiltroAvanzado modular
- [x] **Resumen de filtros** - Indicadores visuales activos

### ✅ Arquitectura y Rendimiento
- [x] **Hooks personalizados** - Separación de responsabilidades
- [x] **useMemo optimizado** - Cálculos pesados solo cuando necesario
- [x] **useCallback implementado** - Funciones optimizadas
- [x] **Componentes modulares** - Reutilización y mantenibilidad
- [x] **CSS optimizado** - Selects personalizados y responsive

## 📊 Métricas y KPIs Implementados

### Métricas Principales
- **Total de Empleados** - Contador global actualizado
- **Empleados Activos** - Con ratio de retención calculado
- **Contrataciones por Período** - Filtradas por mes/año seleccionado
- **Promedio Salarial** - Calculado con parseFloat optimizado

### Métricas Secundarias
- **Empleados Inactivos** - Con alertas por umbrales
- **Antigüedad Media** - Calculada en años con decimales
- **Distribución Salarial** - Rango min-max formateado
- **Ratio de Retención** - Con código de colores dinámico

### Análisis Departamental
- **Distribución por Departamento** - Gráficos de barras responsive
- **Departamento Líder** - Identificación automática del mayor
- **Empleados Recientes** - Lista filtrada de activos

## 🔧 Hooks Avanzados Implementados

### useState
- **Gestión de estado local** - Empleados, animaciones, filtros
- **Estado de carga** - Loading states para UX mejorada
- **Selecciones de usuario** - Año, mes, filtros aplicados

### useEffect
- **Efectos de animación** - Transiciones suaves con cleanup
- **Logging inteligente** - Monitoreo de cambios de métricas
- **Alertas automáticas** - Notificaciones por umbrales críticos
- **Cleanup de timers** - Prevención de memory leaks

### useMemo
- **Optimización de cálculos** - Métricas pesadas solo cuando necesario
- **Filtrado de datos** - Arrays grandes procesados eficientemente
- **Cálculos derivados** - Rangos, promedios, estadísticas

### useCallback
- **Optimización de funciones** - Prevención de re-renders innecesarios
- **Handlers de eventos** - Funciones optimizadas para componentes hijo
- **Funciones de utilidad** - Reutilización eficiente

## 📖 Conceptos de Aprendizaje Cubiertos

### React Avanzado
- **Hooks personalizados** - Separación de lógica de negocio
- **Optimización de rendimiento** - useMemo y useCallback
- **Componentes funcionales** - Arquitectura moderna
- **Props drilling** - Gestión eficiente de datos
- **Event handling** - Manejo optimizado de interacciones

### Inertia.js
- **Server-side routing** - Sin necesidad de APIs REST
- **useForm hook** - Formularios simplificados con validación
- **Flash messages** - Sistema de notificaciones automático
- **Links optimizados** - Navegación SPA seamless

### Laravel Moderno
- **Eloquent ORM** - Relaciones y scopes optimizados
- **Resource Controllers** - CRUD estructurado y escalable
- **Validación robusta** - Request validation y Form Requests
- **Migraciones profesionales** - Schema design escalable
- **Factories realistas** - Datos de prueba con timestamps

### Arquitectura de Software
- **Separación de responsabilidades** - Hooks vs Componentes
- **Principio DRY** - Componentes reutilizables
- **Performance optimization** - Técnicas de memoización
- **Modularidad** - Estructura de carpetas escalable

## 🎓 Objetivos de Aprendizaje Completados

- [x] **Integración Laravel + React** sin APIs REST complejas
- [x] **Hooks avanzados** - useMemo, useCallback, custom hooks
- [x] **Arquitectura escalable** - Separación de responsabilidades
- [x] **Optimización de rendimiento** - Técnicas de memoización
- [x] **Componentes modulares** - Reutilización y mantenibilidad
- [x] **Gestión de estado complejo** - Multiple useState coordinados
- [x] **UX/UI profesional** - Animaciones y estados de carga
- [x] **Patterns de desarrollo** - Mejores prácticas de la industria

## 🚀 Comandos Útiles para Desarrollo

```bash
# Regenerar datos de prueba
php artisan migrate:fresh --seed

# Compilar assets en modo desarrollo
npm run dev

# Build para producción
npm run build

# Limpiar cache de Laravel
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Ejecutar tests (si están implementados)
php artisan test
```

## 🔍 Debugging y Desarrollo

### Console Logs Implementados
- **Métricas actualizadas** - Información detallada de cálculos
- **Alertas automáticas** - Notificaciones por umbrales críticos
- **Estado de hooks** - Debugging de estado interno

### Performance Monitoring
- **useMemo dependencies** - Optimización de recálculos
- **useCallback optimization** - Prevención de re-renders
- **Component re-renders** - Monitoreo de actualizaciones

## 🤝 Contribuciones y Mejoras Futuras

### Áreas de Mejora Potencial
- [ ] **Tests automatizados** - Unit tests para hooks y componentes
- [ ] **Internacionalización** - Soporte multi-idioma
- [ ] **Dark mode** - Tema oscuro con toggle
- [ ] **Gráficos avanzados** - Chart.js o similar para visualizaciones
- [ ] **Exportación de datos** - PDF y Excel reports
- [ ] **Notificaciones push** - Sistema de alertas en tiempo real

### Contribuciones Bienvenidas
- Mejoras en UX/UI y accesibilidad
- Optimizaciones de rendimiento adicionales
- Nuevas funcionalidades de RRHH
- Documentación técnica extendida
- Tests automatizados y CI/CD

## 📄 Licencia

MIT License - Proyecto educativo sin fines comerciales.

## 👨‍💻 Autor

**@rbsnkrs13** - Desarrollador Backend en entrenamiento Front-end.

---

⭐ **Si este proyecto te ayudó en tu aprendizaje de React y Laravel, no olvides darle una estrella!**

🔗 **Enlaces útiles:**
- [Documentación de Inertia.js](https://inertiajs.com/)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro.html)
- [Laravel Documentation](https://laravel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)