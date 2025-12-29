# 🔐 Sistema de Autenticación y Gestión de Usuarios - Acredicom

Sistema web moderno para la gestión de autenticación, usuarios, permisos y sesiones desarrollado para Acredicom. Construido con React, TypeScript y las mejores prácticas de desarrollo frontend.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Características Principales](#-características-principales)
- [Arquitectura](#-arquitectura)
- [Desarrollo](#-desarrollo)
- [Build y Despliegue](#-build-y-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### Autenticación y Seguridad
- 🔑 Sistema de login con JWT (Access y Refresh tokens)
- 🔄 Renovación automática de tokens con reintentos y prevención de loops infinitos
- 🔐 Recuperación de contraseña con código OTP
- 👤 Gestión de perfil de usuario
- 🚪 Cierre de sesión seguro
- 🛡️ Rutas protegidas y públicas
- ✅ Validación centralizada de variables de entorno con Zod
- 📝 Logger configurable (desactiva logs en producción)
- 🛡️ Manejo centralizado de errores de API

### Gestión de Usuarios (Colaboradores)
- 👥 CRUD completo de colaboradores
- 📝 Formularios con validación en tiempo real
- 🖼️ Gestión de fotos de perfil
- 🏢 Asignación de agencias y áreas
- 👔 Asignación de roles y puestos
- 📧 Generación automática de email y username
- 🔑 Generación y envío de contraseñas seguras
- ✅ Control de estados (activo/inactivo, staff, superusuario)

### Gestión de Permisos y Grupos
- 👨‍👩‍👧‍👦 Creación y gestión de grupos de permisos
- 🔐 Asignación de permisos a grupos
- 📱 Gestión de aplicativos
- 🎯 Asignación de grupos a colaboradores (solo en edición)
- 🔍 Búsqueda y filtrado avanzado con scroll infinito
- 📊 Visualización organizada por aplicativo
- 🗑️ Desactivación de grupos (borrado lógico) desde cards
- 🎨 Indicadores visuales para grupos activos/inactivos

### Administración de Sesiones
- 📱 Visualización de sesiones activas por usuario
- 🔄 Agrupación de sesiones por aplicativo
- 🚪 Cierre individual o masivo de sesiones
- 📍 Información de dispositivo e IP
- ⏰ Fechas de creación y expiración

### Gestión Organizacional
- 🏢 CRUD de agencias
- 📍 CRUD de áreas
- 👔 Gestión de roles/puestos
- 🔗 Relaciones entre entidades

### Interfaz de Usuario
- 🎨 Diseño moderno y responsivo
- 🌓 Modo oscuro/claro
- 📱 Totalmente adaptable a móviles
- ♿ Accesible (ARIA labels, navegación por teclado)
- ⚡ Optimizado para rendimiento con code splitting y lazy loading
- 🎯 Feedback visual en todas las operaciones
- ⚡ Caché inteligente de datos con React Query
- 🔄 Scroll infinito para listas grandes

## 🛠️ Tecnologías

### Core
- **React 18.3** - Biblioteca de UI
- **TypeScript 5.6** - Tipado estático
- **Vite 6** - Build tool y dev server
- **React Router 7** - Enrutamiento

### Estado y Datos
- **TanStack Query (React Query) 5** - Manejo de estado del servidor y caché
- **Zustand 5** - Estado global (autenticación, sidebar)
- **React Hook Form 7** - Manejo de formularios
- **Zod 3** - Validación de esquemas

### UI y Estilos
- **Tailwind CSS 4** - Framework de utilidades CSS
- **Radix UI** - Componentes accesibles sin estilos (incluyendo AlertDialog)
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast
- **next-themes** - Gestión de temas

### Tablas y Datos
- **TanStack Table 8** - Tablas avanzadas con sorting, filtering, paginación
- **React Intersection Observer** - Scroll infinito

### Utilidades
- **Axios** - Cliente HTTP con interceptores mejorados
- **date-fns** - Manipulación de fechas
- **FilePond** - Gestión de archivos
- **CodeMirror** - Editor de código JSON
- **dnd-kit** - Drag and drop

### Testing
- **Vitest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **jsdom** - Entorno DOM para tests

## 📦 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **pnpm** >= 8.x
- Acceso al backend de autenticación de Acredicom

## 🚀 Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd authFront
```

2. **Instalar dependencias**
```bash
npm install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_HOST_AUTH_DEV=https://api.acredicom.com
VITE_APLICATIVO_ID=1
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_HOST_AUTH_DEV` | URL base del API de autenticación | ✅ Sí |
| `VITE_APLICATIVO_ID` | ID del aplicativo en el sistema | ✅ Sí |
| `VITE_PASSWORD_RESET_REDIRECT_URL` | URL de redirección después de reset de contraseña | ❌ No (default: `/auth/login`) |
| `VITE_APP_NAME` | Nombre de la aplicación | ❌ No (default: `Acredicom Auth`) |
| `VITE_API_BASE_URL` | URL base de la API | ❌ No (default: `http://localhost:8000`) |
| `VITE_BASE` | Ruta base pública de la aplicación para Vite | ❌ No (default: `/`) |

**Nota**: Las variables de entorno se validan automáticamente al iniciar la aplicación usando Zod. Si falta alguna variable requerida, la aplicación mostrará un error descriptivo.

### Configuración de Vite

El proyecto está configurado con:
- **Base path**: `https://oauth.mcenlinea.com/`
- **Path alias**: `@` apunta a `./src`
- **SWC**: Compilación rápida con React SWC

## 📜 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo en http://localhost:5173

# Build
npm run build        # Construye la aplicación para producción

# Linting
npm run lint         # Ejecuta ESLint para verificar el código

# Preview
npm run preview      # Previsualiza el build de producción en http://localhost:5173

# Testing
npm run test         # Ejecuta los tests con Vitest
npm run test:ui      # Ejecuta los tests con interfaz gráfica
npm run test:coverage # Ejecuta los tests con reporte de cobertura
```

## 📁 Estructura del Proyecto

```text
authFront/
├── public/                 # Archivos estáticos
│   └── img/               # Imágenes públicas
├── src/
│   ├── app/               # Páginas y layouts
│   │   ├── admin/         # Páginas de administración
│   │   │   ├── colaboradores/
│   │   │   ├── agencias/
│   │   │   ├── areas/
│   │   │   └── grupos-permisos/
│   │   ├── auth/          # Páginas de autenticación
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   └── code-otp/
│   │   ├── Providers.tsx  # Proveedores globales
│   │   └── App.tsx        # Componente raíz
│   ├── assets/            # Recursos (imágenes, etc.)
│   ├── components/        # Componentes reutilizables
│   │   ├── form/          # Formularios
│   │   ├── modal/         # Modales
│   │   ├── tables/        # Tablas de datos
│   │   ├── sidebar/       # Componentes del sidebar
│   │   ├── ui/            # Componentes UI base (ShadCN)
│   │   └── ...
│   ├── config/            # Configuraciones
│   │   ├── env.ts         # Validación centralizada de variables de entorno
│   │   ├── constants.ts   # Constantes de la aplicación
│   │   └── environment.ts # Configuración de entorno
│   ├── hooks/             # Custom hooks
│   │   ├── colaboradores/
│   │   ├── agencias/
│   │   ├── areas/
│   │   ├── grupos/
│   │   ├── permisos/
│   │   └── sessions/
│   ├── interfaces/        # Interfaces TypeScript
│   ├── lib/               # Utilidades y helpers
│   │   ├── logger.ts      # Logger configurable
│   │   ├── error-handler.ts # Manejo centralizado de errores
│   │   ├── react-query.ts # Configuración de React Query
│   │   └── ...
│   ├── mappers/           # Mappers de datos
│   ├── models/            # Modelos de datos
│   ├── routes/            # Configuración de rutas
│   │   ├── Router.tsx     # Router principal con lazy loading
│   │   ├── auth.routes.tsx # Rutas de autenticación
│   │   └── admin.routes.tsx # Rutas de administración
│   ├── schemas/           # Esquemas de validación Zod
│   ├── services/          # Servicios API
│   │   ├── base.service.ts # Clase base para servicios
│   │   ├── configAxios.ts # Configuración de Axios con interceptores
│   │   └── ...
│   │   ├── auth/
│   │   ├── colaboradores/
│   │   ├── agencias/
│   │   └── ...
│   ├── store/             # Estado global (Zustand)
│   ├── test/              # Configuración de tests
│   │   └── setup.ts       # Setup de Vitest
│   ├── types/             # Tipos TypeScript
│   └── main.tsx           # Punto de entrada
├── .env                   # Variables de entorno (no commitear)
├── eslint.config.js       # Configuración ESLint
├── tailwind.config.js     # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
├── vite.config.ts         # Configuración Vite
├── vitest.config.ts       # Configuración de Vitest
└── package.json           # Dependencias y scripts
```

## 🎯 Características Principales

### 1. Sistema de Autenticación

- **Login seguro** con validación de credenciales
- **Renovación automática** de tokens mediante interceptores de Axios
- **Recuperación de contraseña** con código OTP enviado por email
- **Gestión de sesiones** con visualización y cierre de sesiones activas

### 2. Gestión de Colaboradores

- **Formulario completo** con validación en tiempo real
- **Generación automática** de email y username basado en el nombre
- **Subida de imágenes** para foto de perfil
- **Asignación de grupos** con selección múltiple
- **Control de permisos** (activo, staff, superusuario)

### 3. Sistema de Permisos

- **Grupos de permisos** organizados por aplicativo
- **Asignación visual** con drag & drop
- **Búsqueda avanzada** con scroll infinito
- **Gestión de aplicativos** con configuración JSON
- **Desactivación de grupos** (borrado lógico) desde cards con confirmación
- **Indicadores visuales** para grupos activos/inactivos
- **Asignación de usuarios** solo disponible en edición (no en creación)

### 4. Tablas de Datos

- **Paginación** avanzada
- **Filtrado** por columnas
- **Ordenamiento** (sorting)
- **Búsqueda global**
- **Selección múltiple**

### 5. Arquitectura y Calidad

- **Code Splitting** con lazy loading de rutas
- **Componentes modulares** y reutilizables
- **Hooks personalizados** para lógica reutilizable
- **Abstracción de servicios** con clase base
- **Constantes centralizadas** para valores configurables
- **Logger estructurado** con niveles y contexto
- **Manejo de errores** consistente en toda la aplicación

## 🏗️ Arquitectura

### Patrón de Arquitectura

El proyecto sigue una arquitectura basada en **capas**:

1. **Presentación** (`components/`, `app/`)
   - Componentes UI y páginas
   - Formularios y tablas

2. **Lógica de Negocio** (`hooks/`, `store/`)
   - Custom hooks para lógica reutilizable
   - Estado global con Zustand

3. **Servicios** (`services/`)
   - Comunicación con API
   - Configuración de Axios

4. **Datos** (`interfaces/`, `models/`, `mappers/`)
   - Tipos TypeScript
   - Transformación de datos

5. **Validación** (`schemas/`)
   - Esquemas Zod para validación

### Flujo de Datos

```text
Componente → Hook → Service → API
     ↓         ↓       ↓       ↓
  Estado   Query   Axios   Interceptor
     ↓         ↓       ↓
  Logger  Caché   Error Handler
```

### Mejoras de Arquitectura

- **Rutas modulares**: Separación de rutas por feature (auth, admin)
- **Lazy Loading**: Carga diferida de componentes de página
- **Configuración centralizada**: Variables de entorno validadas con Zod
- **Servicios base**: Clase abstracta para operaciones CRUD comunes
- **Hooks personalizados**: Lógica reutilizable extraída a hooks
- **Componentes pequeños**: Componentes grandes divididos en subcomponentes

### Manejo de Estado

- **React Query**: Estado del servidor, caché, sincronización
  - Configuración global con staleTime, gcTime y retry logic
  - Caché diferenciado según tipo de dato (estático, semi-estático, dinámico)
  - Reintentos automáticos con exponential backoff
- **Zustand**: Estado global (autenticación, UI)
- **React Hook Form**: Estado de formularios
- **Estado local**: `useState` para estado de componente

### Optimizaciones Implementadas

- **Code Splitting**: Lazy loading de rutas con React.lazy() y Suspense
- **Caché Inteligente**: Configuración de React Query optimizada por tipo de dato
- **Logger Configurable**: Logs deshabilitados en producción automáticamente
- **Manejo de Errores Centralizado**: Utilidad reutilizable para manejo consistente de errores
- **Abstracción de Servicios**: Clase base para servicios API con métodos comunes
- **Constantes Centralizadas**: Valores mágicos extraídos a constantes configurables

## 💻 Desarrollo

### Convenciones de Código

- **TypeScript estricto**: Todos los archivos deben estar tipados
- **Componentes funcionales**: Uso de hooks de React
- **Nombres descriptivos**: Variables y funciones con nombres claros
- **Comentarios**: Solo cuando sea necesario explicar lógica compleja

### Estructura de Componentes

```typescript
// Importaciones externas
import { useState } from "react";

// Importaciones internas
import { Button } from "@/components/ui/button";

// Tipos e interfaces
interface ComponentProps {
  // ...
}

// Componente
export const Component = ({ ...props }: ComponentProps) => {
  // Hooks
  // Lógica
  // Render
  return <div>...</div>;
};
```

### Hooks Personalizados

Los hooks siguen el patrón:
- `useQuery*`: Para consultas (GET) con configuración de caché optimizada
- `useMutation*`: Para mutaciones (POST, PUT, DELETE)
- `useInfinite*`: Para queries con scroll infinito
- Hooks de UI: `useUserSelection`, `useKeyboardShortcuts`, etc.

### Validación de Formularios

Todos los formularios usan:
- **React Hook Form** para manejo de estado
- **Zod** para validación de esquemas
- **@hookform/resolvers** para integración

### Manejo de Errores

- **Utilidad centralizada** (`lib/error-handler.ts`) para manejo consistente
- **Mensajes de error** personalizables por contexto
- **Logging estructurado** con contexto adicional
- **Manejo diferenciado** por código de estado HTTP

## 🏭 Build y Despliegue

### Build de Producción

```bash
npm run build
```

El build se genera en la carpeta `dist/` con:
- Código optimizado y minificado
- Assets procesados
- Code splitting automático por rutas
- Tree shaking para eliminar código no utilizado
- Optimización de imports

### Variables de Entorno en Producción

Asegúrate de configurar las variables de entorno en tu plataforma de despliegue:

- **Vercel**: Configurar en Settings → Environment Variables
- **Netlify**: Configurar en Site settings → Environment variables
- **Docker**: Usar archivo `.env` o variables de entorno del contenedor

### Despliegue

El proyecto está configurado para desplegarse en:
- **Base path**: `https://oauth.mcenlinea.com/`

Ajusta el `base` en `vite.config.ts` según tu entorno.

## 🧪 Testing

El proyecto incluye configuración de testing con:

- **Vitest** - Framework de testing rápido
- **React Testing Library** - Testing de componentes React
- **jsdom** - Entorno DOM simulado para tests

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests con interfaz gráfica
npm run test:ui

# Ejecutar tests con cobertura
npm run test:coverage
```

### Tests Implementados

- Tests unitarios para logger (`src/lib/__tests__/logger.test.ts`)
- Tests para manejo de errores (`src/lib/__tests__/error-handler.test.ts`)
- Tests para validación de variables de entorno (`src/config/__tests__/env.test.ts`)

### Próximos Pasos

Se recomienda añadir:
- Tests de componentes con React Testing Library
- Tests E2E con Playwright o Cypress
- Tests de integración para hooks y servicios

## 📝 Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guías de Contribución

- Sigue las convenciones de código existentes
- Añade documentación para nuevas features
- Asegúrate de que el código pase el linter
- Prueba tus cambios antes de hacer commit

## 🔒 Seguridad

- ✅ **Validación centralizada de variables de entorno** con Zod al inicio de la aplicación
- ✅ **Tokens almacenados** en localStorage (considerar httpOnly cookies para mayor seguridad)
- ✅ **Renovación automática de tokens** con interceptores de Axios
- ✅ **Prevención de loops infinitos** en refresh token con contador de reintentos
- ✅ **Timeout configurable** en requests HTTP (30 segundos)
- ✅ **Validación de formularios** en cliente (Zod) y servidor
- ✅ **Logger configurable** que desactiva logs en producción
- ✅ **Manejo centralizado de errores** con logging estructurado
- ✅ **Rutas protegidas** con componentes de protección
- ✅ **Tipado completo** de variables de entorno en TypeScript

## 📚 Documentación Adicional

- [AUDITORIA_CODIGO.md](./AUDITORIA_CODIGO.md) - Auditoría de código y mejores prácticas
- [INTEGRACIONES/](./INTEGRACIONES/) - Documentación de integraciones

## 🎯 Mejoras Recientes

### Seguridad y Calidad
- ✅ Validación centralizada de variables de entorno con Zod
- ✅ Logger configurable que desactiva logs en producción
- ✅ Manejo centralizado de errores con contexto estructurado
- ✅ Interceptor de Axios mejorado con prevención de loops infinitos
- ✅ Reintentos automáticos con exponential backoff

### Arquitectura y Escalabilidad
- ✅ Code splitting de rutas con lazy loading
- ✅ Rutas modulares por feature (auth, admin)
- ✅ Abstracción base para servicios API
- ✅ Configuración optimizada de React Query por tipo de dato
- ✅ Constantes centralizadas para valores configurables

### Optimización
- ✅ Caché inteligente diferenciado (estático, semi-estático, dinámico)
- ✅ Lazy loading de componentes de página
- ✅ Componentes grandes refactorizados en subcomponentes
- ✅ Hooks personalizados para lógica reutilizable

### Testing
- ✅ Configuración de Vitest y React Testing Library
- ✅ Tests básicos para logger, error handler y configuración
- ✅ Setup de testing con jsdom

## 🐛 Problemas Conocidos

Ver [AUDITORIA_CODIGO.md](./AUDITORIA_CODIGO.md) para una lista completa de problemas conocidos y mejoras sugeridas.

## 📄 Licencia

Ver archivo [LICENSE](./LICENSE) para más detalles.

## 👥 Equipo

Desarrollado para **Acredicom** - Sistema de gestión de autenticación y usuarios.

## 📞 Soporte

Para soporte, contacta al equipo de desarrollo o abre un issue en el repositorio.

---

**Versión**: 0.0.0  
**Última actualización**: 2025
