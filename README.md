# 🎯 Sistema de Gestión de RRHH

Una aplicación web completa para la gestión de Recursos Humanos desarrollada con **Laravel 12**, **Inertia.js** y **React**. Proyecto de entrenamiento que implementa las mejores prácticas del desarrollo full-stack moderno.

## ✨ Características

### 🏢 Gestión de Empleados
- **CRUD completo** - Crear, leer, actualizar y eliminar empleados
- **Formularios avanzados** con validación en tiempo real
- **Vista expandible** tipo accordion para optimizar el espacio
- **Flash messages** para feedback inmediato

### 🔍 Filtros y Búsqueda
- **Búsqueda por nombre** en tiempo real
- **Filtros por departamento** y estado (activo/inactivo)
- **Ordenamiento dinámico** por diferentes criterios
- **Componente reutilizable** de filtros avanzados

### 📊 Dashboard Profesional
- **Métricas en tiempo real** calculadas desde la base de datos
- **Gráficos de distribución** por departamentos
- **Tarjetas interactivas** con datos clave
- **Filtros por período** (mes/año)

### 💾 Base de Datos
- **Migraciones** estructuradas con campos profesionales
- **Factories y Seeders** para datos de prueba realistas
- **Modelo Eloquent** con scopes y accessors
- **Validación robusta** en backend y frontend

## 🛠️ Stack Tecnológico

- **Backend:** Laravel 12
- **Frontend:** React 18 + Inertia.js
- **Base de Datos:** MySQL 8.0
- **Estilos:** Tailwind CSS
- **Build Tool:** Vite
- **IDE:** VSCode

## 🚀 Instalación

### Prerrequisitos
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/rbsnkrs13/rrhh-training.git
   cd rrhh-training
   ```

2. **Instalar dependencias de PHP**
   ```bash
   composer install
   ```

3. **Instalar dependencias de Node.js**
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

6. **Migrar y sembrar la base de datos**
   ```bash
   php artisan migrate:fresh --seed
   ```

7. **Compilar assets y levantar servidores**
   ```bash
   # Terminal 1
   npm run dev
   
   # Terminal 2
   php artisan serve
   ```

8. **Abrir en navegador**
   ```
   http://localhost:8000
   ```

## 📁 Estructura del Proyecto

```
rrhh-training/
├── app/
│   ├── Http/Controllers/EmpleadoController.php
│   ├── Models/Empleado.php
│   └── Http/Middleware/HandleInertiaRequests.php
├── database/
│   ├── migrations/
│   ├── factories/EmpleadoFactory.php
│   └── seeders/EmpleadoSeeder.php
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Empleados.jsx
│   │   │   ├── CrearEmpleado.jsx
│   │   │   └── EditarEmpleado.jsx
│   │   └── Components/
│   │       ├── MetricCard.jsx
│   │       ├── FlashMessage.jsx
│   │       └── FiltroAvanzado.jsx
│   └── views/app.blade.php
└── routes/web.php
```

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard
- [x] Métricas calculadas en tiempo real
- [x] Distribución por departamentos
- [x] Gráficos de barras dinámicos
- [x] Filtros por período temporal
- [x] Lista de empleados recientes

### ✅ Gestión de Empleados
- [x] Lista con vista expandible
- [x] Formulario de creación completo
- [x] Edición con datos pre-cargados
- [x] Eliminación con confirmación
- [x] Validación completa (frontend + backend)

### ✅ Filtros Avanzados
- [x] Búsqueda por nombre/email
- [x] Filtro por departamento
- [x] Filtro por estado
- [x] Ordenamiento múltiple
- [x] Resumen de filtros activos

### ✅ UX/UI
- [x] Diseño responsive
- [x] Flash messages
- [x] Loading states
- [x] Animaciones suaves
- [x] Interfaz intuitiva

## 📖 Aprendizajes Clave

Este proyecto cubre conceptos esenciales para desarrollo full-stack moderno:

### React
- **Hooks:** useState, useEffect
- **Componentes:** Funcionales y reutilizables
- **Props y State:** Manejo de datos
- **Event Handlers:** Interacciones de usuario
- **Conditional Rendering:** Lógica en templates

### Inertia.js
- **Server-side Routing:** Sin APIs REST
- **useForm Hook:** Formularios simplificados
- **Flash Messages:** Feedback automático
- **Links:** Navegación SPA

### Laravel
- **Eloquent ORM:** Modelos y relaciones
- **Resource Controllers:** CRUD estructurado
- **Validación:** Request validation
- **Migraciones:** Estructura de BD
- **Factories/Seeders:** Datos de prueba

## 🎓 Objetivos de Aprendizaje

- [x] Integración Laravel + React sin APIs
- [x] Manejo de estado complejo en React
- [x] Formularios avanzados con validación
- [x] Componentes reutilizables
- [x] Patterns de desarrollo profesional
- [x] UX/UI moderna y responsive

## 🤝 Contribuciones

Este es un proyecto de entrenamiento. Las contribuciones son bienvenidas para:
- Mejoras en UX/UI
- Nuevas funcionalidades
- Optimizaciones de rendimiento
- Documentación adicional

## 📄 Licencia

MIT License - Proyecto educativo sin fines comerciales.

## 👨‍💻 Autor

**@rbsnkrs13** - Desarrollador Backend con nociones en FrontEnd en entrenamiento

---

⭐ **¡No olvides darle una estrella si te ayudó en tu aprendizaje!**