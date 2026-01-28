# Deploy de Guía Restaurant a Coolify desde GitHub

## 📋 Información del Proyecto

**Repositorio GitHub**: https://github.com/Dodo1021/guiarestaurant
**Branch**: main
**Usuario GitHub**: Dodo1021

## 🍽️ Descripción del Proyecto

Guía Restaurant es una aplicación web completa para directorio de restaurantes en México. Stack:
- Next.js 16 (App Router) + React 19 + TypeScript
- PostgreSQL + Prisma ORM
- NextAuth.js v5 para autenticación
- Cloudinary para almacenamiento de imágenes
- Tailwind CSS para estilos

## ✅ Estado Actual

El proyecto está 100% listo para producción:
- ✅ Código completo en GitHub: https://github.com/Dodo1021/guiarestaurant
- ✅ Dockerfile optimizado incluido
- ✅ Todas las dependencias especificadas
- ✅ Documentación completa
- ✅ Seguridad implementada (auth + validación)

## 🚀 Instrucciones para Deploy en Coolify

### 1. Crear Aplicación en Coolify

**Configuración básica:**
- **Tipo**: Public Repository (GitHub)
- **Repository URL**: https://github.com/Dodo1021/guiarestaurant
- **Branch**: main
- **Build Pack**: Dockerfile (auto-detectado)
- **Port**: 3000
- **Health Check Path**: /

### 2. Variables de Entorno Requeridas

```env
# Database (Crear PostgreSQL en Coolify primero)
DATABASE_URL=postgresql://username:password@postgres-host:5432/guiarestaurant

# Authentication
NEXTAUTH_SECRET=GENERAR_VALOR_ALEATORIO_SEGURO_BASE64_32_CARACTERES
NEXTAUTH_URL=USAR_DOMINIO_DE_COOLIFY_POR_AHORA

# Cloudinary (Credenciales ya configuradas)
CLOUDINARY_CLOUD_NAME=deody592t
CLOUDINARY_API_KEY=298532638135654
CLOUDINARY_API_SECRET=6xX0CJfxtHiwAlI5OiNVrtegW_Y
```

**IMPORTANTE sobre las variables:**

1. **DATABASE_URL**: Necesitas crear un servicio PostgreSQL en Coolify primero:
   - Database name: `guiarestaurant`
   - Version: PostgreSQL 14+ (cualquier versión reciente)
   - Coolify generará la URL automáticamente
   - Copiar y pegar en esta variable

2. **NEXTAUTH_SECRET**: Generar uno nuevo (seguro, 32 caracteres en base64):
   - Comando: `openssl rand -base64 32`
   - O generador online: https://generate-secret.vercel.app/32
   - Ejemplo: `7K9mP3nQ8rT2vW5xZ1aB4cD6eF8gH0jK`
   - **NO usar el del .env de desarrollo**

3. **NEXTAUTH_URL**: Por ahora usar el dominio automático de Coolify:
   - Formato típico: `https://guiarestaurant-xxxxx.coolify.io`
   - Más adelante se cambiará al dominio custom

### 3. Crear Base de Datos PostgreSQL

**Pasos en Coolify:**
1. New Resource → Database → PostgreSQL
2. Configuration:
   - Name: `guiarestaurant-db`
   - Version: 14 o superior
   - Database name: `guiarestaurant`
3. Coolify generará automáticamente:
   - Username
   - Password
   - Host
   - Port
4. Copiar el **connection string completo** generado
5. Pegarlo en la variable `DATABASE_URL`

**Formato esperado:**
```
postgresql://usuario:password@host:5432/guiarestaurant
```

### 4. Proceso de Deploy

**Orden de ejecución:**
1. Crear el servicio PostgreSQL primero (paso 3)
2. Crear la aplicación conectando el repositorio GitHub
3. Configurar TODAS las variables de entorno (paso 2)
4. Iniciar el build/deploy
5. Esperar que el build termine (primera vez: 3-5 minutos)
6. Verificar que el contenedor esté corriendo y saludable

**El build incluye automáticamente:**
- ✅ Instalación de dependencias (`npm ci`)
- ✅ Generación de cliente Prisma
- ✅ Build optimizado de Next.js
- ✅ Creación de imagen Docker multi-stage

### 5. Post-Deploy (CRÍTICO - Ejecutar UNA SOLA VEZ)

Después del primer deploy exitoso, **DEBES ejecutar el seed** para crear el usuario administrador:

**Desde la consola de Coolify o SSH al servidor:**

```bash
# Opción 1: Desde consola de Coolify
npm run db:seed

# Opción 2: Si accedes por SSH
docker ps | grep guiarestaurant
docker exec -it <container-id> npm run db:seed
```

**Salida esperada:**
```
Usuario administrador creado:
Email: admin@guiarestaurant.com
Password: admin123
¡IMPORTANTE! Cambia esta contraseña en producción
Seed completado exitosamente
```

⚠️ **Notas importantes:**
- Ejecutar el seed **solo una vez** después del primer deploy
- La contraseña `admin123` es temporal y debe cambiarse en producción
- Si ejecutas el seed múltiples veces, no causará error (usa `upsert`)

## ✅ Verificación Post-Deploy

Después del deploy, verificar en este orden:

### 1. Health Check
- Coolify debe mostrar el contenedor como "healthy" (verde)
- Si está "unhealthy", revisar logs

### 2. Homepage
- URL: `https://tu-dominio-coolify.io`
- Debe cargar: Página principal con header "Guía Restaurant"
- Debe verse: Buscador con filtros (Estado, Municipio, Nombre)
- Debe funcionar: Dropdowns de búsqueda

### 3. Admin Login
- URL: `https://tu-dominio-coolify.io/admin/login`
- Credenciales:
  - Email: `admin@guiarestaurant.com`
  - Password: `admin123`
- Debe: Acceder al dashboard sin errores
- Debe verse: Lista de restaurantes (vacía al inicio)

### 4. Crear Restaurante de Prueba
- En dashboard, click "Nuevo Restaurante"
- Llenar campos mínimos:
  - Nombre: "Restaurante de Prueba"
  - Descripción: cualquier texto
  - Dirección: cualquier texto
  - Teléfono: 5512345678
  - Estado: seleccionar cualquiera
  - Municipio: seleccionar cualquiera
  - Categoría: "Mexicana" (separar múltiples con comas)
- Subir una imagen (cualquier JPG/PNG)
- Click "Crear Restaurante"
- Debe: Guardar sin errores y redirigir al dashboard

### 5. Verificar Upload a Cloudinary
**MUY IMPORTANTE**:
- La imagen subida debe tener URL de Cloudinary
- URL correcta: `https://res.cloudinary.com/deody592t/image/upload/...`
- URL incorrecta: `/uploads/...` (esto indica que Cloudinary NO funciona)
- Para verificar: Abrir DevTools → Network → Ver request de upload

### 6. Verificar en Homepage
- Ir a: `https://tu-dominio-coolify.io`
- Buscar el restaurante creado (debe aparecer en la lista)
- Verificar que la imagen carga correctamente
- Probar los filtros de búsqueda
- Si hay más de 20 restaurantes, verificar paginación

## 🐛 Troubleshooting - Problemas Comunes

### Error: "Database connection failed"
**Causa**: `DATABASE_URL` incorrecta o PostgreSQL no accesible

**Soluciones:**
1. Verificar que el contenedor PostgreSQL está corriendo (verde en Coolify)
2. Verificar que `DATABASE_URL` tiene el formato correcto
3. Verificar que los contenedores están en la misma red Docker
4. Intentar conectar desde el contenedor de la app:
   ```bash
   docker exec -it <app-container> psql $DATABASE_URL
   ```

### Error: "NEXTAUTH_SECRET is not defined"
**Causa**: Variable de entorno no configurada o mal formateada

**Soluciones:**
1. Verificar en Coolify → Environment Variables que existe
2. Verificar que no tiene espacios al inicio/final
3. Verificar que es un string válido base64
4. Re-deploy después de agregar/corregir

### Error: "Build failed" con errores de Prisma
**Causa**: Prisma no puede generar cliente o conectar a DB durante build

**Soluciones:**
1. Verificar que `DATABASE_URL` está disponible durante el build
2. En Coolify, algunas variables deben estar en "Build Environment Variables"
3. Revisar logs de build para ver el error exacto de Prisma
4. Verificar que el schema en `prisma/schema.prisma` es válido

### Error: "Cannot upload images" o "Upload returns /uploads/..."
**Causa**: Cloudinary no configurado correctamente

**Soluciones:**
1. Verificar las 3 variables en Coolify:
   - `CLOUDINARY_CLOUD_NAME=deody592t`
   - `CLOUDINARY_API_KEY=298532638135654`
   - `CLOUDINARY_API_SECRET=6xX0CJfxtHiwAlI5OiNVrtegW_Y`
2. Verificar que no tienen espacios o caracteres extra
3. Probar las credenciales en: https://console.cloudinary.com
4. Re-deploy después de corregir

### Error: "Page not found" en rutas admin
**Causa**: Build de Next.js incompleto o rutas no generadas

**Soluciones:**
1. Verificar que el build completó exitosamente
2. Revisar logs de build para errores de TypeScript
3. Verificar que todas las páginas se generaron en `.next/`
4. Limpiar cache y re-build

### Error: 502 Bad Gateway
**Causa**: Aplicación no está escuchando en el puerto correcto o crasheó

**Soluciones:**
1. Verificar logs del contenedor: `docker logs <container-id>`
2. Verificar que la app escucha en puerto 3000
3. Verificar que el contenedor está corriendo: `docker ps`
4. Verificar Health Check en Coolify

## 📊 Recursos del Sistema

**Requerimientos mínimos:**
- **CPU**: 1 core (0.5 cores funciona pero puede ser lento)
- **RAM**: 512 MB mínimo, 1 GB recomendado
- **Disco**: 500 MB para la imagen + logs
- **PostgreSQL**: 256 MB RAM mínimo

**Rendimiento esperado:**
- Primera carga (cold start): 2-3 segundos
- Cargas subsecuentes: 1-2 segundos
- API responses: 100-500ms
- Build time: 3-5 minutos (primera vez), 2-3 minutos (siguientes)

## 📝 Notas Adicionales

### Sobre el Almacenamiento
- **No se necesita volumen persistente**: Las imágenes van a Cloudinary (no al disco local)
- El directorio `/public/uploads/` existe pero se usa solo como fallback
- Cloudinary maneja: almacenamiento, CDN, optimización, redimensionamiento

### Sobre las Migraciones
- El Dockerfile ejecuta `prisma generate` automáticamente en el build
- Las migraciones se aplican al iniciar si es necesario
- El schema está en: `prisma/schema.prisma`

### Sobre el Seed
- Solo ejecutar una vez después del primer deploy
- Crea el usuario admin inicial
- Usa `upsert`, así que ejecutarlo múltiples veces no causa problemas
- Los datos de seed están en: `prisma/seed.ts`

### Auto-Deploy (Opcional)
Puedes configurar en Coolify para que haga deploy automáticamente en cada push a `main`:
1. Settings → GitHub Integration
2. Enable "Auto Deploy on Push"
3. Cada push a `main` hará deploy automático

## 🔄 Después del Deploy Inicial

Una vez verificado que todo funciona correctamente:

1. **Dominio Custom**:
   - Cuando se proporcione el dominio real (ej: `guiarestaurant.com`)
   - Configurar en Coolify → Domains
   - Actualizar `NEXTAUTH_URL` con el nuevo dominio
   - Re-deploy

2. **SSL**:
   - Coolify configura Let's Encrypt automáticamente
   - Verificar que el certificado está activo (candado verde en navegador)

3. **Seguridad**:
   - Cambiar contraseña del admin lo antes posible
   - Considerar agregar rate limiting
   - Monitorear logs para intentos de acceso no autorizados

## 📚 Documentación Disponible

El repositorio incluye documentación completa:
- `README.md` - Documentación general del proyecto
- `GITHUB-COOLIFY-DEPLOY.md` - Guía detallada de deployment
- `CLAUDE.md` - Documentación técnica completa para desarrolladores
- `CAMBIOS-IMPLEMENTADOS.md` - Resumen de features implementadas
- `SECURITY-AUDIT.md` - Auditoría de seguridad (todas las vulnerabilidades corregidas)
- `CLOUDINARY-SETUP.md` - Configuración de Cloudinary
- `SCALABILITY-LIMITS.md` - Análisis de capacidad del sistema

## ✅ Checklist de Deploy

Marcar cada paso al completarlo:

- [ ] PostgreSQL creado en Coolify
- [ ] `DATABASE_URL` copiada y configurada
- [ ] `NEXTAUTH_SECRET` generado y configurado
- [ ] `NEXTAUTH_URL` configurado con dominio de Coolify
- [ ] Variables de Cloudinary configuradas (las 3)
- [ ] Aplicación creada en Coolify conectada al repo
- [ ] Build iniciado
- [ ] Build completado exitosamente (sin errores)
- [ ] Contenedor corriendo (status: healthy)
- [ ] Seed ejecutado (admin user creado)
- [ ] Homepage carga correctamente
- [ ] Admin login funciona
- [ ] Crear restaurante de prueba funciona
- [ ] Upload de imagen a Cloudinary funciona
- [ ] Búsqueda y filtros funcionan
- [ ] Paginación funciona (si hay 20+ items)

---

**Link del Repositorio**: https://github.com/Dodo1021/guiarestaurant

**¿Alguna pregunta o necesitas aclaración sobre algún paso?**
