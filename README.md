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
- 🔄 Renovación automática de tokens
- 🔐 Recuperación de contraseña con código OTP
- 👤 Gestión de perfil de usuario
- 🚪 Cierre de sesión seguro
- 🛡️ Rutas protegidas y públicas

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
- 🎯 Asignación de grupos a colaboradores
- 🔍 Búsqueda y filtrado avanzado
- 📊 Visualización organizada por aplicativo

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
- ⚡ Optimizado para rendimiento
- 🎯 Feedback visual en todas las operaciones

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
- **Radix UI** - Componentes accesibles sin estilos
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast
- **next-themes** - Gestión de temas

### Tablas y Datos
- **TanStack Table 8** - Tablas avanzadas con sorting, filtering, paginación
- **React Intersection Observer** - Scroll infinito

### Utilidades
- **Axios** - Cliente HTTP
- **date-fns** - Manipulación de fechas
- **FilePond** - Gestión de archivos
- **CodeMirror** - Editor de código JSON
- **dnd-kit** - Drag and drop

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
```

## 📁 Estructura del Proyecto

```
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
│   ├── hooks/             # Custom hooks
│   │   ├── colaboradores/
│   │   ├── agencias/
│   │   ├── areas/
│   │   ├── grupos/
│   │   ├── permisos/
│   │   └── sessions/
│   ├── interfaces/        # Interfaces TypeScript
│   ├── lib/               # Utilidades y helpers
│   ├── mappers/           # Mappers de datos
│   ├── models/            # Modelos de datos
│   ├── routes/            # Configuración de rutas
│   ├── schemas/           # Esquemas de validación Zod
│   ├── services/           # Servicios API
│   │   ├── auth/
│   │   ├── colaboradores/
│   │   ├── agencias/
│   │   └── ...
│   ├── store/             # Estado global (Zustand)
│   ├── types/             # Tipos TypeScript
│   └── main.tsx           # Punto de entrada
├── .env                   # Variables de entorno (no commitear)
├── eslint.config.js       # Configuración ESLint
├── tailwind.config.js     # Configuración Tailwind
├── tsconfig.json          # Configuración TypeScript
├── vite.config.ts         # Configuración Vite
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

### 4. Tablas de Datos

- **Paginación** avanzada
- **Filtrado** por columnas
- **Ordenamiento** (sorting)
- **Búsqueda global**
- **Selección múltiple**

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

```
Componente → Hook → Service → API
     ↓         ↓       ↓
  Estado   Query   Axios
```

### Manejo de Estado

- **React Query**: Estado del servidor, caché, sincronización
- **Zustand**: Estado global (autenticación, UI)
- **React Hook Form**: Estado de formularios
- **Estado local**: `useState` para estado de componente

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
- `useQuery*`: Para consultas (GET)
- `useMutation*`: Para mutaciones (POST, PUT, DELETE)

### Validación de Formularios

Todos los formularios usan:
- **React Hook Form** para manejo de estado
- **Zod** para validación de esquemas
- **@hookform/resolvers** para integración

## 🏭 Build y Despliegue

### Build de Producción

```bash
npm run build
```

El build se genera en la carpeta `dist/` con:
- Código optimizado y minificado
- Assets procesados
- Code splitting automático

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

> **Nota**: Actualmente no hay tests implementados. Se recomienda añadir:
> - Tests unitarios con Vitest
> - Tests de componentes con React Testing Library
> - Tests E2E con Playwright o Cypress

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

- ✅ Validación de variables de entorno al inicio
- ✅ Tokens almacenados de forma segura
- ✅ Renovación automática de tokens
- ✅ Validación de formularios en cliente y servidor
- ✅ Sanitización de inputs
- ✅ Rutas protegidas

## 📚 Documentación Adicional

- [AUDITORIA_CODIGO.md](./AUDITORIA_CODIGO.md) - Auditoría de código y mejores prácticas
- [INTEGRACIONES/](./INTEGRACIONES/) - Documentación de integraciones

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
