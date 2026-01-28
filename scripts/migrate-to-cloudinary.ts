/**
 * Script para migrar imágenes locales a Cloudinary
 *
 * USO:
 * npm install --save-dev tsx
 * npx tsx scripts/migrate-to-cloudinary.ts
 *
 * Este script:
 * 1. Lee todos los restaurantes de la base de datos
 * 2. Encuentra imágenes locales (/uploads/...)
 * 3. Las sube a Cloudinary
 * 4. Actualiza las URLs en la base de datos
 */

import { PrismaClient } from '@prisma/client';
import cloudinary from '../lib/cloudinary';
import { readFile } from 'fs/promises';
import { join } from 'path';

const prisma = new PrismaClient();

async function migrateImages() {
  console.log('🚀 Iniciando migración de imágenes a Cloudinary...\n');

  try {
    // Obtener todos los restaurantes
    const restaurants = await prisma.restaurant.findMany();
    console.log(`📊 Encontrados ${restaurants.length} restaurantes\n`);

    let totalMigrated = 0;
    let totalErrors = 0;

    for (const restaurant of restaurants) {
      console.log(`\n🍴 Procesando: ${restaurant.name} (ID: ${restaurant.id})`);

      const newImageUrls: string[] = [];
      let hasChanges = false;

      for (const imageUrl of restaurant.imagenes) {
        // Solo migrar imágenes locales
        if (imageUrl.startsWith('/uploads/')) {
          try {
            console.log(`  📤 Subiendo: ${imageUrl}`);

            // Leer archivo local
            const localPath = join(process.cwd(), 'public', imageUrl);
            const fileBuffer = await readFile(localPath);

            // Subir a Cloudinary
            const result = await new Promise<any>((resolve, reject) => {
              cloudinary.uploader.upload_stream(
                {
                  folder: 'guiarestaurant',
                  transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto:good' },
                    { fetch_format: 'auto' }
                  ],
                  resource_type: 'image'
                },
                (error, result) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              ).end(fileBuffer);
            });

            newImageUrls.push(result.secure_url);
            hasChanges = true;
            totalMigrated++;

            console.log(`  ✅ Migrada a: ${result.secure_url}`);
          } catch (error) {
            console.error(`  ❌ Error migrando ${imageUrl}:`, error);
            // Mantener la URL original si falla
            newImageUrls.push(imageUrl);
            totalErrors++;
          }
        } else {
          // Mantener URLs de Cloudinary existentes
          newImageUrls.push(imageUrl);
          console.log(`  ⏭️  Ya está en Cloudinary: ${imageUrl}`);
        }
      }

      // Actualizar base de datos si hubo cambios
      if (hasChanges) {
        await prisma.restaurant.update({
          where: { id: restaurant.id },
          data: { imagenes: newImageUrls }
        });
        console.log(`  💾 Actualizado en base de datos`);
      }
    }

    console.log('\n\n✅ ¡Migración completada!');
    console.log(`📊 Resumen:`);
    console.log(`   - Imágenes migradas: ${totalMigrated}`);
    console.log(`   - Errores: ${totalErrors}`);
    console.log(`   - Total restaurantes procesados: ${restaurants.length}`);

  } catch (error) {
    console.error('\n❌ Error en la migración:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
migrateImages()
  .then(() => {
    console.log('\n🎉 ¡Proceso terminado exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });
