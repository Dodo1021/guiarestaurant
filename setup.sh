#!/bin/bash

echo "🍴 Guía Restaurant - Setup Script"
echo "=================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus credenciales de base de datos"
    echo ""
fi

# Copy logo to public if exists
if [ -f image.png ] && [ ! -f public/image.png ]; then
    echo "🖼️  Copiando logo a public/..."
    cp image.png public/
fi

# Install dependencies
echo "📦 Instalando dependencias..."
npm install

# Check if database exists
echo ""
echo "🗄️  Configurando base de datos..."
echo "Asegúrate de que PostgreSQL esté corriendo y que hayas configurado DATABASE_URL en .env"
read -p "¿Continuar con la configuración de la base de datos? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run db:push
    npm run db:seed
    
    echo ""
    echo "✅ Setup completado!"
    echo ""
    echo "👤 Usuario administrador creado:"
    echo "   Email: admin@guiarestaurant.com"
    echo "   Password: admin123"
    echo ""
    echo "⚠️  IMPORTANTE: Cambia esta contraseña inmediatamente en producción"
    echo ""
    echo "🚀 Para iniciar el servidor de desarrollo:"
    echo "   npm run dev"
    echo ""
    echo "🌐 Luego abre:"
    echo "   - Sitio público: http://localhost:3000"
    echo "   - Panel admin: http://localhost:3000/admin/login"
fi
