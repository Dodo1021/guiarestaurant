# Configuración de Cloudinary - Paso a Paso

## 📝 Paso 1: Crear Cuenta GRATIS

1. **Ir a:** https://cloudinary.com/users/register_free
2. **Llenar formulario:**
   - Nombre
   - Email
   - Contraseña
   - Tipo de cuenta: "Developer" o "Personal"
3. **Verificar email** (te llegará un correo)
4. **Listo!** Tienes 25 GB gratis

---

## 🔑 Paso 2: Obtener Credenciales

Después de registrarte:

1. **Dashboard:** https://console.cloudinary.com/console
2. Verás algo como esto:

```
┌─────────────────────────────────────┐
│  Product Environment Credentials    │
├─────────────────────────────────────┤
│  Cloud Name:  dxxxxxxxx             │
│  API Key:     123456789012345       │
│  API Secret:  xXxXxXxXxXxXxXxXxX    │ ← Click "Show" para verlo
└─────────────────────────────────────┘
```

3. **Copiar estos 3 valores:**
   - Cloud Name
   - API Key
   - API Secret

---

## ⚙️ Paso 3: Agregar a .env

Abre tu archivo `.env` y agrega al final:

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME="dxxxxxxxx"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="xXxXxXxXxXxXxXxXxX"
```

**⚠️ IMPORTANTE:**
- Reemplaza con TUS valores reales
- NO compartas estos valores con nadie
- El API Secret es como una contraseña

---

## ✅ Verificación

Después de configurar:

1. Guarda el archivo `.env`
2. Reinicia el servidor: `npm run dev`
3. Listo! Cloudinary está configurado

---

## 🎯 Lo que viene después

Una vez configurado, podrás:

✅ Subir imágenes a Cloudinary (en lugar del VPS)
✅ Imágenes se optimizan automáticamente
✅ Se comprimen para ahorrar espacio
✅ Cargan más rápido (CDN global)

**Costo:** $0 (hasta 25 GB)
**25 GB =** ~5,000 imágenes de restaurantes

---

## 📊 Plan Gratuito Incluye

- ✅ 25 GB almacenamiento
- ✅ 25 GB ancho de banda/mes
- ✅ Compresión automática
- ✅ Redimensionamiento automático
- ✅ CDN global
- ✅ SSL/HTTPS

**Suficiente para 500-1,000 restaurantes fácilmente**
