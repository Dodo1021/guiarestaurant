import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { 
  sanitizeText, 
  sanitizeUrl, 
  sanitizePhone, 
  sanitizeEmail,
  validateImageUrls,
  isValidCloudinaryUrl 
} from "@/lib/security";

// Schema de validación estricto
const registroSchema = z.object({
  // Datos del propietario
  ownerName: z.string().min(2).max(100),
  ownerEmail: z.string().email().max(254),
  ownerPhone: z.string().min(10).max(20),
  
  // Datos del restaurante
  name: z.string().min(2).max(200),
  description: z.string().max(2000).optional(),
  address: z.string().min(5).max(500),
  phone: z.string().min(10).max(20),
  email: z.string().email().max(254).optional().or(z.literal("")),
  website: z.string().url().max(500).optional().or(z.literal("")),
  facebook: z.string().max(200).optional(),
  instagram: z.string().max(100).optional(),
  whatsapp: z.string().max(20).optional(),
  estado: z.string().min(2).max(100),
  municipio: z.string().min(2).max(100),
  codigoPostal: z.string().max(10).optional(),
  categoria: z.array(z.string().max(50)).max(5).default([]),
  precioPromedio: z.enum(["$", "$$", "$$$", "$$$$"]).optional(),
  
  // Horarios - se valida en el backend
  horarios: z.any().optional(),
  
  // Imágenes - solo URLs de Cloudinary
  logo: z.string().url().max(500).optional().or(z.literal("")),
  imagenes: z.array(z.string().url().max(500)).max(6).default([]),
  
  // Honeypot - debe estar vacío (bots lo llenan)
  website2: z.string().max(0).optional(),
});

// Límite de registros por email (anti-spam)
const REGISTROS_MAX_POR_EMAIL = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot check - si website2 tiene valor, es un bot
    if (body.website2 && body.website2.length > 0) {
      // Simular éxito para no alertar al bot
      return NextResponse.json(
        { success: true, message: "Registro enviado para revisión" },
        { status: 201 }
      );
    }

    // Validar datos
    const validation = registroSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Datos inválidos. Revisa el formulario." },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verificar límite de registros por email
    const existingCount = await prisma.restaurant.count({
      where: { ownerEmail: data.ownerEmail.toLowerCase() }
    });

    if (existingCount >= REGISTROS_MAX_POR_EMAIL) {
      return NextResponse.json(
        { error: "Has alcanzado el límite de registros. Contacta soporte." },
        { status: 429 }
      );
    }

    // Validar que las imágenes sean de Cloudinary
    const validImagenes = validateImageUrls(data.imagenes);
    const validLogo = data.logo && isValidCloudinaryUrl(data.logo) ? data.logo : null;

    // Sanitizar todos los inputs
    const sanitizedData = {
      name: sanitizeText(data.name),
      description: sanitizeText(data.description),
      address: sanitizeText(data.address),
      phone: sanitizePhone(data.phone),
      email: data.email ? sanitizeEmail(data.email) : null,
      website: data.website ? sanitizeUrl(data.website) : null,
      facebook: sanitizeText(data.facebook),
      instagram: sanitizeText(data.instagram),
      whatsapp: sanitizePhone(data.whatsapp),
      estado: sanitizeText(data.estado),
      municipio: sanitizeText(data.municipio),
      codigoPostal: data.codigoPostal ? sanitizeText(data.codigoPostal) : null,
      categoria: data.categoria.map(c => sanitizeText(c)).filter(Boolean),
      precioPromedio: data.precioPromedio || null,
      horarios: data.horarios || null,
      imagenes: validImagenes,
      logo: validLogo,
      ownerName: sanitizeText(data.ownerName),
      ownerEmail: sanitizeEmail(data.ownerEmail),
      ownerPhone: sanitizePhone(data.ownerPhone),
    };

    // Crear restaurante con status "pending"
    const restaurant = await prisma.restaurant.create({
      data: {
        ...sanitizedData,
        destacado: false,
        activo: true,
        status: "pending",
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Registro enviado para revisión",
      }, 
      { status: 201 }
    );
  } catch (error) {
    // Log interno sin exponer detalles
    console.error("Registration error:", error instanceof Error ? error.message : "Unknown");
    return NextResponse.json(
      { error: "Error al procesar el registro. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
