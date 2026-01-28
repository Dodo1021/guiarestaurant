# 🚀 Guía de Deploy: GitHub + Coolify

## Estado Actual ✅

Tu proyecto está **100% listo** para GitHub y Coolify:

- ✅ Git inicializado y commit realizado
- ✅ `.gitignore` configurado (no subirá node_modules, .env, etc.)
- ✅ README.md profesional con documentación completa
- ✅ Dockerfile optimizado para producción
- ✅ 56 archivos, 15,868 líneas de código commitadas
- ✅ Branch: `main`
- ✅ Commit: `2264938` - "Initial commit: Guía Restaurant - Production Ready"

---

## 📦 Paso 1: Crear Repositorio en GitHub

### Opción A: Desde la Web (Más Fácil)

1. **Ir a GitHub** → https://github.com/new

2. **Configurar el repositorio:**
   - **Repository name**: `guiarestaurant`
   - **Description**: `Directorio web de restaurantes de México con búsqueda avanzada y panel de administración`
   - **Visibility**:
     - ✅ **Private** (recomendado, es un proyecto comercial)
     - ⚠️ Public (solo si quieres que sea open source)
   - **NO marcar**: "Add README", "Add .gitignore", "Add license"
     - Ya tienes estos archivos configurados

3. **Click en**: "Create repository"

4. **Copiar la URL** que aparece (algo como):
   ```
   https://github.com/TU-USUARIO/guiarestaurant.git
   ```

5. **Continuar al Paso 2** ⬇️

---

### Opción B: Desde Terminal (Requiere GitHub CLI)

Si tienes `gh` CLI instalado:

```bash
cd "/Volumes/Samsung 4TB/Proyectos/guiarestaurant"

# Crear repo privado
gh repo create guiarestaurant --private --source=. --remote=origin --push

# O público
gh repo create guiarestaurant --public --source=. --remote=origin --push
```

---

## 🔗 Paso 2: Conectar con GitHub y Hacer Push

En tu terminal, ejecuta:

```bash
cd "/Volumes/Samsung 4TB/Proyectos/guiarestaurant"

# Agregar remote (reemplaza TU-USUARIO con tu username de GitHub)
git remote add origin https://github.com/TU-USUARIO/guiarestaurant.git

# Verificar que se agregó correctamente
git remote -v

# Push al repositorio
git push -u origin main
```

**Resultado esperado:**
```
Enumerating objects: 61, done.
Counting objects: 100% (61/61), done.
Delta compression using up to 8 threads
Compressing objects: 100% (55/55), done.
Writing objects: 100% (61/61), 1.23 MiB | 2.45 MiB/s, done.
Total 61 (delta 4), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (4/4), done.
To https://github.com/TU-USUARIO/guiarestaurant.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

✅ **Listo, tu código está en GitHub!**

Verifica en: `https://github.com/TU-USUARIO/guiarestaurant`

---

## 🐳 Paso 3: Configurar Coolify

### 3.1 Crear Nueva Aplicación

1. **Ir a tu panel de Coolify**
2. **Click en**: "New Resource" o "Add New Project"
3. **Seleccionar**: "Public Repository" o "GitHub Repository"

### 3.2 Conectar Repositorio

1. **Repository URL**: `https://github.com/TU-USUARIO/guiarestaurant`
2. **Branch**: `main`
3. **Build Pack**: "Dockerfile" (Coolify lo detectará automáticamente)

### 3.3 Configurar Build

**Build Settings:**
- ✅ **Dockerfile Path**: `/Dockerfile` (default)
- ✅ **Build Command**: `npm run build` (ya incluido en Dockerfile)
- ✅ **Port**: `3000`
- ✅ **Health Check Path**: `/`

### 3.4 Variables de Entorno

**CRÍTICO**: Agregar estas variables en Coolify:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://usuario:password@host:5432/guiarestaurant

# Authentication (CAMBIAR EL SECRET!)
NEXTAUTH_SECRET=GENERA-UNO-NUEVO-AQUI
NEXTAUTH_URL=https://tudominio.com

# Cloudinary (Imágenes)
CLOUDINARY_CLOUD_NAME=deody592t
CLOUDINARY_API_KEY=298532638135654
CLOUDINARY_API_SECRET=6xX0CJfxtHiwAlI5OiNVrtegW_Y
```

**⚠️ IMPORTANTE - Generar NEXTAUTH_SECRET:**

Opción 1: En tu Mac
```bash
openssl rand -base64 32
```

Opción 2: Online
- https://generate-secret.vercel.app/32

**Copiar el resultado** y pegarlo en `NEXTAUTH_SECRET`

### 3.5 Configurar Base de Datos

**Opción A: PostgreSQL en Coolify (Recomendado)**

1. En Coolify → "New Resource" → "Database" → "PostgreSQL"
2. Crear base de datos: `guiarestaurant`
3. Coolify generará automáticamente la URL
4. Copiar y pegar en `DATABASE_URL`

**Opción B: Base de Datos Externa**

Puedes usar servicios como:
- **Neon** (gratis 500MB): https://neon.tech
- **Supabase** (gratis 500MB): https://supabase.com
- **Railway** (gratis $5/mes): https://railway.app

Configurar y copiar la `DATABASE_URL` a Coolify.

### 3.6 Dominio

1. **En Coolify**: Settings → Domains
2. **Agregar dominio**: `tudominio.com` o subdominio `guia.tudominio.com`
3. **SSL**: Coolify configura automáticamente Let's Encrypt
4. **Actualizar `NEXTAUTH_URL`** con el dominio final

---

## 🚀 Paso 4: Primer Deploy

1. **Click en "Deploy"** en Coolify
2. **Esperar el build** (2-5 minutos la primera vez)
3. **Ver logs** para verificar que todo está OK

**Logs esperados:**
```
Building Docker image...
✓ Dependencies installed
✓ Prisma client generated
✓ Next.js build successful
✓ Container started on port 3000
✓ Health check passed
```

---

## ⚙️ Paso 5: Post-Deploy (Una sola vez)

Después del primer deploy exitoso, ejecutar el seed para crear el usuario admin:

### Opción A: Desde Coolify Console

1. Ir a tu aplicación en Coolify
2. Click en "Console" o "Terminal"
3. Ejecutar:
```bash
npm run db:seed
```

### Opción B: Desde SSH

```bash
# Conectar al servidor VPS
ssh tu-usuario@tu-vps.com

# Encontrar el contenedor
docker ps | grep guiarestaurant

# Ejecutar seed
docker exec -it <container-id> npm run db:seed
```

**Resultado esperado:**
```
Usuario administrador creado:
Email: admin@guiarestaurant.com
Password: admin123
¡IMPORTANTE! Cambia esta contraseña en producción
```

---

## ✅ Paso 6: Verificar Deploy

1. **Abrir tu dominio**: `https://tudominio.com`
2. **Verificar que carga** la página principal
3. **Ir a login**: `https://tudominio.com/admin/login`
4. **Hacer login**:
   - Email: `admin@guiarestaurant.com`
   - Password: `admin123`
5. **Crear un restaurante de prueba**:
   - Llenar formulario
   - Subir una imagen
   - Verificar que se sube a Cloudinary (URL debe ser `https://res.cloudinary.com/...`)
6. **Ver en página pública**: Buscar el restaurante creado

---

## 🔄 Deploys Futuros

Cada vez que hagas cambios:

```bash
cd "/Volumes/Samsung 4TB/Proyectos/guiarestaurant"

# 1. Hacer cambios en el código

# 2. Commit
git add .
git commit -m "Descripción de los cambios"

# 3. Push
git push origin main
```

**Coolify auto-deploy:**
- Si configuraste "Auto Deploy", Coolify hará deploy automáticamente
- Si no, click en "Deploy" manualmente en Coolify

---

## 🐛 Troubleshooting

### Error: "Database connection failed"

**Causa**: `DATABASE_URL` incorrecta o base de datos no accesible

**Solución:**
1. Verificar que PostgreSQL está corriendo
2. Verificar credenciales en `DATABASE_URL`
3. En Coolify, verificar que los contenedores están en la misma red

### Error: "NEXTAUTH_SECRET is not defined"

**Causa**: Variable de entorno no configurada

**Solución:**
1. Ir a Coolify → Environment Variables
2. Agregar `NEXTAUTH_SECRET` con un valor seguro
3. Re-deploy

### Error: "Build failed" - Prisma errors

**Causa**: Schema de Prisma tiene problemas

**Solución:**
```bash
# Localmente, verificar que funciona
npm run build

# Si funciona localmente, el problema es en Coolify
# Verificar DATABASE_URL en Coolify
```

### Error: Image upload fails

**Causa**: Credenciales de Cloudinary incorrectas

**Solución:**
1. Verificar en Coolify las 3 variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
2. Verificar en https://console.cloudinary.com que son correctas
3. Re-deploy

### Error: "Permission denied" en uploads

**Causa**: Ya no aplica con Cloudinary, pero si usas uploads locales

**Solución:**
El Dockerfile ya crea el directorio con permisos correctos.

---

## 📊 Monitoreo Post-Deploy

### Métricas a Verificar

1. **Logs de Coolify**:
   - Ver errores en tiempo real
   - Acceder desde panel de Coolify

2. **Cloudinary Dashboard**:
   - https://console.cloudinary.com/console
   - Ver cuántas imágenes tienes
   - Verificar uso del plan gratuito (25 GB)

3. **Base de Datos**:
   - Conectar con Prisma Studio: `npm run db:studio`
   - O desde herramienta externa (TablePlus, pgAdmin)

### Comandos Útiles

```bash
# Ver logs en vivo
docker logs -f <container-name>

# Ver uso de recursos
docker stats <container-name>

# Conectar al contenedor
docker exec -it <container-name> sh

# Ejecutar migraciones manualmente
docker exec -it <container-name> npm run db:push

# Ver estado de la aplicación
curl https://tudominio.com
```

---

## 🔒 Seguridad Post-Deploy

### Cambiar Contraseña del Admin

**Muy importante hacer esto inmediatamente:**

1. Login en `/admin/login`
2. En el futuro: Crear página de cambio de contraseña
3. Por ahora, cambiar en la base de datos:

```sql
-- Conectar a PostgreSQL
UPDATE "User"
SET password = 'nuevo-hash-bcrypt'
WHERE email = 'admin@guiarestaurant.com';
```

O crear script:
```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const newPassword = await bcrypt.hash('TuNuevaContraseñaSegura123!', 10);

await prisma.user.update({
  where: { email: 'admin@guiarestaurant.com' },
  data: { password: newPassword }
});

console.log('Contraseña actualizada');
await prisma.\$disconnect();
"
```

---

## 📚 Recursos Adicionales

- **README.md**: Documentación completa del proyecto
- **CLAUDE.md**: Documentación técnica para desarrolladores
- **CAMBIOS-IMPLEMENTADOS.md**: Resumen de implementaciones
- **SECURITY-AUDIT.md**: Auditoría de seguridad
- **CLOUDINARY-SETUP.md**: Configuración de Cloudinary

---

## ✅ Checklist Final

Antes de considerar el deploy completado:

- [ ] Código subido a GitHub
- [ ] Coolify conectado al repositorio
- [ ] Variables de entorno configuradas
- [ ] `NEXTAUTH_SECRET` generado y cambiado
- [ ] Base de datos creada y conectada
- [ ] Primer deploy exitoso
- [ ] Seed ejecutado (usuario admin creado)
- [ ] Login funcionando
- [ ] Upload de imágenes a Cloudinary funcionando
- [ ] Página pública cargando correctamente
- [ ] Búsqueda y filtros funcionando
- [ ] Paginación funcionando
- [ ] Dominio configurado con SSL
- [ ] Contraseña del admin cambiada

---

## 🎉 ¡Felicidades!

Tu aplicación está en producción y lista para recibir restaurantes.

**Próximos pasos opcionales:**
- Configurar Google Analytics
- Implementar PWA (app móvil)
- Agregar rate limiting
- Configurar backups automáticos
- SEO optimization

---

**¿Necesitas ayuda?**
- Email: hola@guiarestaurant.com
- Documentación: Ver archivos `.md` en el repositorio
