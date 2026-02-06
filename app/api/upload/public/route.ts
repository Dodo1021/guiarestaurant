import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

// Magic bytes para verificar que realmente es una imagen
const IMAGE_SIGNATURES: { [key: string]: number[] } = {
  jpeg: [0xFF, 0xD8, 0xFF],
  png: [0x89, 0x50, 0x4E, 0x47],
  webp: [0x52, 0x49, 0x46, 0x46], // RIFF header
};

function isValidImage(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // Verificar JPEG
  if (
    buffer[0] === IMAGE_SIGNATURES.jpeg[0] &&
    buffer[1] === IMAGE_SIGNATURES.jpeg[1] &&
    buffer[2] === IMAGE_SIGNATURES.jpeg[2]
  ) {
    return true;
  }

  // Verificar PNG
  if (
    buffer[0] === IMAGE_SIGNATURES.png[0] &&
    buffer[1] === IMAGE_SIGNATURES.png[1] &&
    buffer[2] === IMAGE_SIGNATURES.png[2] &&
    buffer[3] === IMAGE_SIGNATURES.png[3]
  ) {
    return true;
  }

  // Verificar WebP (RIFF....WEBP)
  if (
    buffer[0] === IMAGE_SIGNATURES.webp[0] &&
    buffer[1] === IMAGE_SIGNATURES.webp[1] &&
    buffer[2] === IMAGE_SIGNATURES.webp[2] &&
    buffer[3] === IMAGE_SIGNATURES.webp[3] &&
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50 // P
  ) {
    return true;
  }

  return false;
}

// Sanitizar nombre de archivo
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .substring(0, 100);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió ningún archivo" },
        { status: 400 }
      );
    }

    // Validar tipo MIME (primera capa)
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no permitido. Solo JPEG, PNG y WebP." },
        { status: 400 }
      );
    }

    // Validar tamaño (5MB máximo)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "El archivo es muy grande. Máximo 5MB." },
        { status: 400 }
      );
    }

    // Validar tamaño mínimo (evitar archivos vacíos o muy pequeños)
    if (file.size < 1000) {
      return NextResponse.json(
        { error: "El archivo es muy pequeño o está corrupto." },
        { status: 400 }
      );
    }

    // Convertir archivo a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Verificar magic bytes (segunda capa - verificación real del contenido)
    if (!isValidImage(buffer)) {
      return NextResponse.json(
        { error: "El archivo no es una imagen válida." },
        { status: 400 }
      );
    }

    // Subir a Cloudinary con optimizaciones y sanitización
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "guiarestaurant/registros",
          // Transformaciones de seguridad: recodificar la imagen
          transformation: [
            { width: 1200, height: 800, crop: "limit" },
            { quality: "auto:good" },
            { fetch_format: "auto" }
          ],
          resource_type: "image",
          // Generar un nombre único, no usar el original
          public_id: `img_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          // Sanitizar metadata
          overwrite: false,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    // Log interno sin exponer detalles al usuario
    console.error("Upload error:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Error al procesar la imagen" },
      { status: 500 }
    );
  }
}
