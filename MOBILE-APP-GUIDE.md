# Guía de Conversión a App Móvil - Guía Restaurant

**Fecha:** 2026-01-27
**Versión:** 1.0

---

## 🎯 RESPUESTA DIRECTA: "¿Puedo hacer una app?"

**SÍ, absolutamente.** Tienes 3 opciones principales:

1. **PWA (Progressive Web App)** - Lo más fácil y rápido ⭐ RECOMENDADO
2. **React Native con Expo** - Nativo real, más trabajo
3. **Capacitor** - Híbrido, punto medio

**Panel de Admin:** Sí, se queda solo en web (correcto ✅)
**Base de datos:** La misma, compartida entre web y app ✅
**APIs:** Las mismas que ya tienes ✅

---

## 📱 OPCIÓN 1: PWA (Progressive Web App) ⭐ RECOMENDADO

### ¿Qué es?

Una PWA es tu sitio web actual que funciona como app nativa:
- Se puede "instalar" desde el navegador
- Aparece en la pantalla de inicio como app
- Funciona offline (con configuración)
- No necesita App Store ni Play Store
- **Tiempo de implementación: 1-2 días**

### Ventajas

✅ Mismo código para iOS y Android
✅ No necesitas revisar App Store/Play Store
✅ Actualizaciones instantáneas (sin esperar aprobación)
✅ Menor costo de desarrollo (casi gratis)
✅ Funciona en navegador también
✅ Notificaciones push (con configuración)

### Desventajas

❌ No aparece en App Store/Play Store (se instala desde web)
❌ Funcionalidad limitada vs app nativa (cámara, GPS con permisos)
❌ Algunos usuarios no entienden cómo "instalar"

### Implementación Paso a Paso

#### 1. Crear Manifest (5 minutos)

```bash
# Crear archivo
touch public/manifest.json
```

```json
{
  "name": "Guía Restaurant",
  "short_name": "GuíaRest",
  "description": "Directorio de restaurantes de México",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#2C3E5F",
  "theme_color": "#2C3E5F",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

#### 2. Crear Iconos de App

**Herramienta:** https://favicon.io/favicon-converter/

1. Sube tu logo (`image.png`)
2. Genera iconos en múltiples tamaños
3. Descarga y guarda en `public/`:
   - `icon-192.png`
   - `icon-512.png`
   - `apple-touch-icon.png`

#### 3. Agregar Meta Tags en Layout

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Guía Restaurant',
  description: 'Directorio de restaurantes de México',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Guía Restaurant',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  themeColor: '#2C3E5F',
}
```

#### 4. Implementar Service Worker (Offline)

**Opción A: Manual (más control)**

```bash
# Instalar workbox
npm install workbox-webpack-plugin
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  // tu config actual
})
```

**Opción B: Automático (más fácil)**

```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60 // 1 año
        }
      }
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 // 24 horas
        }
      }
    },
    {
      urlPattern: /\/api\/restaurants/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60 // 5 minutos
        }
      }
    }
  ]
})

module.exports = withPWA({
  // tu config actual
})
```

#### 5. Agregar Botón de Instalación (Opcional)

```typescript
// components/InstallPWA.tsx
'use client';

import { useEffect, useState } from 'react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white shadow-xl rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="font-bold text-primary">¡Instala Guía Restaurant!</p>
        <p className="text-sm text-gray-600">Acceso rápido desde tu inicio</p>
      </div>
      <button
        onClick={handleInstall}
        className="bg-accent text-primary px-4 py-2 rounded-lg font-bold"
      >
        Instalar
      </button>
    </div>
  );
}
```

```typescript
// app/page.tsx
import InstallPWA from '@/components/InstallPWA';

export default function Home() {
  return (
    <>
      {/* Tu contenido actual */}
      <InstallPWA />
    </>
  );
}
```

### Cómo los Usuarios Instalan la PWA

**iOS (Safari):**
1. Abrir https://tudominio.com
2. Tocar botón "Compartir"
3. "Agregar a pantalla de inicio"
4. Listo! Aparece como app

**Android (Chrome):**
1. Abrir https://tudominio.com
2. Aparece banner "Agregar a pantalla de inicio"
3. Tocar "Instalar"
4. Listo! Aparece como app

### Testing PWA

**Herramientas:**
- Chrome DevTools > Lighthouse > PWA
- https://www.pwabuilder.com/ (validador)

**Checklist:**
- [ ] Manifest.json válido
- [ ] Iconos en múltiples tamaños
- [ ] HTTPS habilitado (Coolify lo hace automático)
- [ ] Service worker registrado
- [ ] Funciona offline (páginas visitadas)

---

## 📱 OPCIÓN 2: React Native con Expo

### ¿Qué es?

App 100% nativa para iOS y Android, escrita en React.

### Ventajas

✅ App nativa real (mejor rendimiento)
✅ Acceso completo a funcionalidades del dispositivo
✅ Publicable en App Store y Play Store
✅ Reutilizas lógica de React (pero no componentes)
✅ Expo facilita muchísimo el desarrollo

### Desventajas

❌ Hay que reescribir toda la UI
❌ Más tiempo de desarrollo (2-4 semanas)
❌ Necesitas cuenta de desarrollador:
  - Apple: $99 USD/año
  - Google Play: $25 USD (una vez)
❌ Proceso de revisión de App Store (1-2 semanas)
❌ Dos bases de código (web + mobile)

### Arquitectura

```
Proyecto/
├── guiarestaurant/          # Tu proyecto actual (web)
│   ├── app/
│   ├── components/
│   └── ...
│
└── guiarestaurant-mobile/   # Nueva app móvil
    ├── app/
    │   ├── (tabs)/
    │   │   ├── index.tsx    # Pantalla de búsqueda
    │   │   ├── favorites.tsx
    │   │   └── profile.tsx
    │   ├── restaurant/[id].tsx
    │   └── _layout.tsx
    ├── components/
    │   ├── RestaurantCard.tsx  # Reescrito para RN
    │   └── SearchBar.tsx       # Reescrito para RN
    └── lib/
        └── api.ts              # ✅ Mismas APIs que web
```

### Implementación

#### 1. Crear Proyecto Expo

```bash
# En el directorio padre
npx create-expo-app guiarestaurant-mobile

cd guiarestaurant-mobile
```

#### 2. Configurar API Client

```typescript
// lib/api.ts
const API_URL = 'https://tudominio.com/api';

export async function getRestaurants(params: {
  estado?: string;
  municipio?: string;
  search?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params.estado) queryParams.append('estado', params.estado);
  if (params.municipio) queryParams.append('municipio', params.municipio);
  if (params.search) queryParams.append('search', params.search);

  const response = await fetch(`${API_URL}/restaurants?${queryParams}`);
  return response.json();
}

export async function getRestaurant(id: string) {
  const response = await fetch(`${API_URL}/restaurants/${id}`);
  return response.json();
}

// ... más funciones según necesites
```

#### 3. Ejemplo de Pantalla

```typescript
// app/(tabs)/index.tsx
import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getRestaurants } from '@/lib/api';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBar from '@/components/SearchBar';

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [filters, setFilters] = useState({ estado: '', municipio: '' });

  useEffect(() => {
    getRestaurants(filters).then(setRestaurants);
  }, [filters]);

  return (
    <View style={styles.container}>
      <SearchBar onSearch={setFilters} />
      <FlatList
        data={restaurants}
        renderItem={({ item }) => <RestaurantCard restaurant={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
```

### Deploy de App

**iOS (App Store):**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android (Play Store):**
```bash
eas build --platform android
eas submit --platform android
```

**Costo de Expo:**
- Gratis para desarrollo
- $29/mes para builds ilimitados (opcional)

---

## 📱 OPCIÓN 3: Capacitor (Hybrid)

### ¿Qué es?

Envuelve tu app web actual en un contenedor nativo.

### Ventajas

✅ Reutilizas 100% del código web
✅ Acceso a APIs nativas (cámara, GPS, etc.)
✅ Publicable en tiendas de apps
✅ Menos trabajo que React Native

### Desventajas

❌ Rendimiento menor que nativo puro
❌ Tamaño de app más grande
❌ Puede sentirse "menos nativa"

### Implementación

```bash
# En tu proyecto actual
npm install @capacitor/core @capacitor/cli
npx cap init

# Agregar plataformas
npx cap add ios
npx cap add android

# Build y sincronizar
npm run build
npx cap sync

# Abrir en Xcode/Android Studio
npx cap open ios
npx cap open android
```

---

## 🔄 COMPARTIR BACKEND ENTRE WEB Y APP

### Arquitectura Recomendada

```
                    ┌─────────────────┐
                    │  PostgreSQL DB  │
                    └────────┬────────┘
                             │
                    ┌────────┴────────┐
                    │   Next.js API   │ ← Backend único
                    │   /api/*        │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         ┌────▼────┐    ┌───▼────┐    ┌───▼────┐
         │ Web App │    │iOS App │    │Android │
         │ (Next)  │    │ (RN)   │    │  (RN)  │
         └─────────┘    └────────┘    └────────┘
```

### APIs que Ya Tienes (Funcionan para App)

✅ `GET /api/restaurants` - Lista de restaurantes
✅ `GET /api/restaurants/[id]` - Detalle de restaurante
✅ `GET /api/estados` - Lista de estados
✅ `GET /api/estados/[codigo]` - Municipios por estado

### APIs que Necesitarías Agregar

**Solo si quieres funcionalidad de usuarios en la app:**

```typescript
// POST /api/users/favorites
// Guardar favoritos de usuario

// GET /api/users/favorites
// Obtener favoritos de usuario

// POST /api/restaurants/[id]/rating
// Calificar restaurante

// POST /api/users/register
// Registro de usuario (opcional)
```

**Admin Panel:**
Correcto ✅ - Se queda SOLO en web, no necesita estar en la app

---

## 💰 COMPARACIÓN DE COSTOS

| Aspecto | PWA | React Native | Capacitor |
|---------|-----|--------------|-----------|
| Desarrollo inicial | 1-2 días | 2-4 semanas | 3-7 días |
| Costo de desarrollo | $0 | $0-500 | $0-200 |
| Apple Developer | $0 | $99/año | $99/año |
| Google Play | $0 | $25 (una vez) | $25 (una vez) |
| Hosting adicional | $0 | $0 | $0 |
| Mantenimiento/mes | $0 | $0-100 | $0-50 |
| **TOTAL primer año** | **$0** | **$124-699** | **$124-349** |

---

## 🎯 RECOMENDACIÓN FINAL

### Para tu caso específico (Guía Restaurant):

**Fase 1 - AHORA:** PWA ⭐
- Implementa PWA en 1-2 días
- Costo: $0
- Usuarios pueden instalarla fácilmente
- Funciona en iOS y Android
- Mismo código que ya tienes

**Fase 2 - Si tiene tracción (6-12 meses):** React Native
- Solo si tienes > 5,000 usuarios activos
- Solo si necesitas features nativas específicas
- Solo si puedes invertir $500-2,000 en desarrollo

**NO RECOMENDADO:** Capacitor
- PWA hace lo mismo pero más fácil
- Si vas a invertir, mejor React Native

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN PWA

**Día 1:**
- [ ] Crear `public/manifest.json`
- [ ] Generar iconos (192px, 512px, apple-touch)
- [ ] Actualizar `app/layout.tsx` con metadata
- [ ] Instalar `next-pwa`

**Día 2:**
- [ ] Configurar `next.config.js` con PWA
- [ ] Crear componente InstallPWA (opcional)
- [ ] Testing en Chrome DevTools > Lighthouse
- [ ] Testing en dispositivo real (iOS y Android)

**Deploy:**
- [ ] Push a Coolify
- [ ] Verificar HTTPS funcionando
- [ ] Verificar manifest.json accesible
- [ ] Probar instalación en móvil

---

## 📊 EJEMPLO REAL DE USO

**Usuario en iPhone:**

1. Entra a https://guiarestaurant.com
2. Safari sugiere "Agregar a pantalla de inicio"
3. Acepta
4. Ahora tiene icono de "Guía Restaurant" en su home
5. Abre la app → Funciona como app nativa
6. Puede buscar restaurantes sin internet (si ya los cargó)
7. Recibe notificaciones (si implementas Push)

**Experiencia:**
- Parece app nativa ✅
- Carga rápido ✅
- Funciona offline ✅
- No ocupó espacio innecesario ✅

---

## 🚀 SIGUIENTE PASO

**Te recomiendo:**

1. Implementar PWA AHORA (1-2 días)
2. Lanzar y obtener usuarios
3. Recopilar feedback
4. Decidir si React Native vale la pena más adelante

**Comando para empezar:**

```bash
cd /Volumes/Samsung\ 4TB/Proyectos/guiarestaurant
npm install next-pwa
```

¿Quieres que implemente la PWA ahora mismo?
