# 🍽️ Guía Restaurant

> Directorio web de restaurantes de México con sistema de búsqueda avanzada y panel de administración

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## 📋 Descripción

Guía Restaurant es una aplicación web completa para directorio de restaurantes en México. Los restaurantes pagan por aparecer en el listado y obtienen visibilidad en todo el país.

### ✨ Características Principales

- 🔍 **Búsqueda Avanzada**: Filtros dinámicos por estado, municipio y nombre
- 📱 **Totalmente Responsive**: Diseño mobile-first, optimizado para todos los dispositivos
- 🔐 **Panel de Administración**: CRUD completo para gestión de restaurantes
- ☁️ **Almacenamiento en la Nube**: Imágenes en Cloudinary con optimización automática
- ⚡ **Alto Rendimiento**: Paginación inteligente (1-2s de carga)
- 🛡️ **Seguro**: Autenticación, validación de datos y protección de APIs
- 🎨 **Diseño Profesional**: Interfaz moderna con colores de marca personalizados

## 🛠️ Tecnologías

### Core
- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma 5.22

### Frontend
- **Estilos**: Tailwind CSS 3.4
- **Componentes**: React 19
- **Imágenes**: Next.js Image + Cloudinary CDN

### Backend
- **API**: Next.js API Routes
- **Autenticación**: NextAuth.js v5
- **Validación**: Zod

### DevOps
- **Deployment**: Docker + Coolify
- **Cloud Storage**: Cloudinary (imágenes)

## 📦 Instalación

### Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Configuración Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU-USUARIO/guiarestaurant.git
cd guiarestaurant
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` con:

```env
# Database
DATABASE_URL="postgresql://usuario@localhost:5432/guiarestaurant"

# Authentication
NEXTAUTH_SECRET="genera-uno-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (imágenes)
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

4. **Crear base de datos**
```bash
createdb guiarestaurant
```

5. **Ejecutar migraciones**
```bash
npm run db:push
```

6. **Seed inicial (crear usuario admin)**
```bash
npm run db:seed
```

Credenciales por defecto:
- Email: `admin@guiarestaurant.com`
- Password: `admin123`

⚠️ **Cambiar contraseña en producción**

7. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 📁 Estructura del Proyecto

```
guiarestaurant/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Página principal pública
│   ├── admin/                    # Panel de administración
│   │   ├── (protected)/          # Rutas protegidas
│   │   └── login/                # Login page
│   └── api/                      # API Routes
│       ├── restaurants/          # CRUD restaurantes
│       ├── estados/              # Estados y municipios
│       └── upload/               # Upload de imágenes
├── components/                   # Componentes React
│   ├── SearchBar.tsx            # Búsqueda con filtros
│   ├── RestaurantGrid.tsx       # Grid con paginación
│   ├── RestaurantCard.tsx       # Tarjeta de restaurante
│   └── admin/                   # Componentes del admin
├── lib/                         # Utilidades
│   ├── auth.ts                  # Configuración NextAuth
│   ├── prisma.ts                # Cliente Prisma
│   ├── cloudinary.ts            # Configuración Cloudinary
│   ├── estados-municipios.ts    # Datos de México
│   └── validations/             # Esquemas Zod
├── prisma/                      # Schema y migraciones
│   ├── schema.prisma            # Modelos de datos
│   └── seed.ts                  # Datos iniciales
├── scripts/                     # Scripts de utilidad
│   └── migrate-to-cloudinary.ts # Migración de imágenes
└── public/                      # Archivos estáticos
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm start                # Servidor de producción

# Base de datos
npm run db:push          # Actualizar schema (desarrollo)
npm run db:migrate       # Crear migración (producción)
npm run db:seed          # Seed de datos iniciales
npm run db:studio        # Abrir Prisma Studio

# Utilidades
npx tsx scripts/migrate-to-cloudinary.ts  # Migrar imágenes a Cloudinary
```

## 🚀 Deployment en Coolify

### Paso 1: Subir a GitHub

```bash
# Inicializar git (si no está inicializado)
git init
git add .
git commit -m "Initial commit: Guía Restaurant ready for production"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/guiarestaurant.git
git branch -M main
git push -u origin main
```

### Paso 2: Configurar Coolify

1. **Conectar repositorio de GitHub**
   - En Coolify, crear nuevo proyecto
   - Conectar con tu repositorio
   - Branch: `main`

2. **Configurar variables de entorno**

En Coolify, agregar:

```env
DATABASE_URL=postgresql://usuario:password@host:5432/dbname
NEXTAUTH_SECRET=tu-secreto-super-seguro-generado-con-openssl
NEXTAUTH_URL=https://tudominio.com
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

**⚠️ IMPORTANTE**: Generar nuevo `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

3. **Build Settings**
   - Build Command: `npm run build` (ya incluye prisma generate)
   - Port: `3000`
   - Health Check: `/`

4. **Post-Deploy**

Ejecutar una sola vez después del primer deploy:

```bash
npm run db:seed
```

### Paso 3: Configurar Base de Datos

Opción 1: PostgreSQL en Coolify
- Coolify puede crear un PostgreSQL automáticamente
- Usar la URL generada en `DATABASE_URL`

Opción 2: Base de datos externa (Neon, Supabase, etc.)
```env
DATABASE_URL=postgresql://...
```

### Paso 4: Verificar Deploy

1. Abrir la URL de tu aplicación
2. Verificar que carga la página principal
3. Ir a `/admin/login` y hacer login
4. Probar crear un restaurante con imagen
5. Verificar que la imagen se suba a Cloudinary

## 📝 Configuración de Cloudinary

1. Crear cuenta gratis en [cloudinary.com](https://cloudinary.com/users/register_free)
2. Obtener credenciales del dashboard
3. Agregar a `.env`:
   ```env
   CLOUDINARY_CLOUD_NAME="tu_cloud_name"
   CLOUDINARY_API_KEY="tu_api_key"
   CLOUDINARY_API_SECRET="tu_api_secret"
   ```

Plan gratuito incluye:
- ✅ 25 GB almacenamiento (~5,000 imágenes)
- ✅ 25 GB ancho de banda/mes
- ✅ Optimización y CDN global

Más detalles en: `CLOUDINARY-SETUP.md`

## 📚 Documentación Completa

El proyecto incluye documentación detallada:

- **`CLAUDE.md`** - Documentación técnica completa para desarrolladores
- **`CAMBIOS-IMPLEMENTADOS.md`** - Resumen de todas las implementaciones
- **`SECURITY-AUDIT.md`** - Auditoría de seguridad (✅ todas corregidas)
- **`SCALABILITY-LIMITS.md`** - Análisis de capacidad y límites
- **`MOBILE-APP-GUIDE.md`** - Guía para convertir a app móvil
- **`CLOUDINARY-SETUP.md`** - Configuración de Cloudinary paso a paso
- **`MIGRACION-CLOUDINARY.md`** - Cómo migrar imágenes locales a Cloudinary

## 🔐 Seguridad

✅ **Todo implementado y seguro para producción**

- ✅ Autenticación en todas las rutas de administración
- ✅ Validación de datos con Zod en todos los inputs
- ✅ Sanitización de archivos subidos
- ✅ Variables de entorno para secretos
- ✅ Debug mode solo en desarrollo
- ✅ Upload protegido (solo admins)

## 🎯 Capacidad del Sistema

Con la configuración actual:

| Métrica | Capacidad |
|---------|-----------|
| Restaurantes | 1,000 - 2,000 |
| Imágenes | 5,000+ (25 GB gratis) |
| Usuarios concurrentes | 100 - 500 |
| Tiempo de carga | 1-2 segundos |
| RAM por request | 50-100 MB |

Ver análisis completo en `SCALABILITY-LIMITS.md`

## ⚡ Características Implementadas

### Frontend Público
- [x] Búsqueda con filtros dinámicos (Estado, Municipio, Nombre)
- [x] Paginación (20 restaurantes por página)
- [x] Diseño responsive (mobile-first)
- [x] Dropdowns dinámicos (seleccionar estado → cargar municipios)
- [x] Grid adaptativo (1/2/3 columnas según pantalla)

### Panel de Administración
- [x] Login seguro con NextAuth
- [x] Dashboard con lista de restaurantes
- [x] Crear restaurante (formulario completo)
- [x] Editar restaurante (pre-carga de datos)
- [x] Eliminar restaurante (con confirmación)
- [x] Upload múltiple de imágenes a Cloudinary
- [x] Navegación mobile con hamburger menu

### Backend & APIs
- [x] API de restaurantes con paginación
- [x] API de estados y municipios
- [x] Upload de imágenes a Cloudinary
- [x] Autenticación en todas las rutas admin
- [x] Validación con Zod en todos los inputs
- [x] Optimización de imágenes automática

### Base de Datos
- [x] Schema Prisma completo
- [x] Migraciones configuradas
- [x] Seed script para admin user
- [x] Índices para optimización

## 🤝 Contribuir

Este es un proyecto privado/comercial. Para cambios o mejoras, contactar al propietario.

## 📧 Contacto

- Email: hola@guiarestaurant.com
- Hashtags: #BuenProvecho #SaborSinFronteras #AmoGuiaRestaurant

## 📄 Licencia

Copyright © 2026 Guía Restaurant. Todos los derechos reservados.

---

**Desarrollado con ❤️ para conectar a México con su gastronomía**
