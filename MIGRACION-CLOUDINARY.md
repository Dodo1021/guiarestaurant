# Migración de Imágenes a Cloudinary

## ¿Qué hace este script?

Si ya tienes restaurantes con imágenes guardadas en `/public/uploads/`, este script las migrará automáticamente a Cloudinary.

**El script:**
1. Lee todos los restaurantes de la base de datos
2. Encuentra imágenes locales (`/uploads/...`)
3. Las sube a Cloudinary (con optimización automática)
4. Actualiza las URLs en la base de datos
5. Mantiene imágenes que ya están en Cloudinary

---

## ¿Cuándo usar este script?

- ✅ **Si ya tienes restaurantes con imágenes locales** → Ejecuta el script
- ❌ **Si es un proyecto nuevo sin restaurantes** → NO necesitas ejecutarlo

---

## Cómo Ejecutar la Migración

### Paso 1: Instalar tsx (si no lo tienes)

```bash
npm install --save-dev tsx
```

### Paso 2: Ejecutar el script

```bash
npx tsx scripts/migrate-to-cloudinary.ts
```

### Paso 3: Observar el proceso

Verás algo como esto:

```
🚀 Iniciando migración de imágenes a Cloudinary...

📊 Encontrados 5 restaurantes

🍴 Procesando: La Casa de Toño (ID: 1)
  📤 Subiendo: /uploads/1234567890-taco.jpg
  ✅ Migrada a: https://res.cloudinary.com/deody592t/image/upload/v1234/guiarestaurant/abc123.jpg
  💾 Actualizado en base de datos

🍴 Procesando: El Farolito (ID: 2)
  ⏭️  Ya está en Cloudinary: https://res.cloudinary.com/...

✅ ¡Migración completada!
📊 Resumen:
   - Imágenes migradas: 12
   - Errores: 0
   - Total restaurantes procesados: 5
```

---

## Qué Pasa con las Imágenes Locales

Después de la migración:

1. ✅ **Base de datos actualizada** con URLs de Cloudinary
2. ✅ **Imágenes en Cloudinary** optimizadas y comprimidas
3. ⚠️ **Archivos locales siguen en `/public/uploads/`**

### ¿Puedo borrar /public/uploads/?

**Sí, pero SOLO después de:**
1. Verificar que la migración fue exitosa (0 errores)
2. Comprobar que los restaurantes cargan las imágenes correctamente en el navegador
3. Hacer un backup por si acaso

```bash
# Hacer backup primero
cp -r public/uploads /ruta/al/backup/uploads-backup

# Después de verificar todo, puedes borrar
rm -rf public/uploads
```

---

## Si Algo Sale Mal

### Error: "Cannot find module 'tsx'"
```bash
npm install --save-dev tsx
```

### Error: "Cloudinary credentials not found"
Verifica tu archivo `.env`:
```env
CLOUDINARY_CLOUD_NAME="deody592t"
CLOUDINARY_API_KEY="298532638135654"
CLOUDINARY_API_SECRET="6xX0CJfxtHiwAlI5OiNVrtegW_Y"
```

### Error: "File not found"
Algunas imágenes pueden no existir físicamente. El script:
- ⚠️ Mostrará un error para esa imagen
- ✅ Mantendrá la URL original
- ✅ Continuará con las demás imágenes

### Restaurar desde backup
Si algo sale mal y quieres volver atrás:

```bash
# 1. Restaurar archivos
cp -r /ruta/al/backup/uploads-backup public/uploads

# 2. Restaurar base de datos (si tienes backup)
# O ejecuta el script de nuevo, es idempotente
```

---

## Funcionalidad Nueva: Cloudinary Activado

Después de la migración, **TODAS las nuevas imágenes** se subirán automáticamente a Cloudinary:

✅ Cuando agregas un nuevo restaurante
✅ Cuando editas y subes nuevas fotos
✅ Optimización automática (compresión, formato WebP)
✅ Redimensionamiento a 1200x800px máximo
✅ CDN global (carga rápida en todo el mundo)

---

## Monitoreo de Cloudinary

Para ver tus imágenes y uso:

1. **Dashboard:** https://console.cloudinary.com/console
2. **Ver imágenes:** Media Library → Carpeta "guiarestaurant"
3. **Ver uso:** Dashboard → Usage (cuánto espacio llevas)

**Límite gratis:** 25 GB = ~5,000 imágenes de restaurantes

---

## Preguntas Frecuentes

**¿Puedo ejecutar el script varias veces?**
Sí, es seguro. Solo subirá imágenes que aún estén en `/uploads/`.

**¿Cuánto tarda?**
~2-5 segundos por imagen. 100 imágenes = ~5-10 minutos.

**¿Afecta la velocidad del sitio?**
No, la migración es un proceso único. Después, el sitio será MÁS RÁPIDO (CDN de Cloudinary).

**¿Qué pasa con las URLs viejas?**
Se reemplazan automáticamente por URLs de Cloudinary. Los enlaces viejos dejarán de funcionar.

**¿Y si un restaurante tiene 20 imágenes?**
Todas se migran. El script procesa cada restaurante completo antes de continuar.
