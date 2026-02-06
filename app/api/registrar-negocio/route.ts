import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const horarioSchema = z.object({
  abierto: z.boolean(),
  apertura: z.string(),
  cierre: z.string(),
});

const registroSchema = z.object({
  // Datos del propietario
  ownerName: z.string().min(2, "Nombre requerido"),
  ownerEmail: z.string().email("Email inválido"),
  ownerPhone: z.string().min(10, "Teléfono inválido"),
  
  // Datos del restaurante
  name: z.string().min(2, "Nombre del restaurante requerido"),
  description: z.string().optional(),
  address: z.string().min(5, "Dirección requerida"),
  phone: z.string().min(10, "Teléfono del negocio requerido"),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  estado: z.string().min(2, "Estado requerido"),
  municipio: z.string().min(2, "Municipio requerido"),
  codigoPostal: z.string().optional(),
  categoria: z.array(z.string()).default([]),
  precioPromedio: z.string().optional(),
  
  // Horarios (JSON)
  horarios: z.record(horarioSchema).optional(),
  
  // Imágenes
  logo: z.string().url().optional().or(z.literal("")),
  imagenes: z.array(z.string().url()).default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validation = registroSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Crear restaurante con status "pending"
    const restaurant = await prisma.restaurant.create({
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        phone: data.phone,
        email: data.email || null,
        website: data.website || null,
        facebook: data.facebook || null,
        instagram: data.instagram || null,
        whatsapp: data.whatsapp || null,
        estado: data.estado,
        municipio: data.municipio,
        codigoPostal: data.codigoPostal || null,
        categoria: data.categoria,
        precioPromedio: data.precioPromedio || null,
        horarios: data.horarios || null,
        imagenes: data.imagenes,
        logo: data.logo || null,
        destacado: false,
        activo: true,
        status: "pending", // ← Pendiente de aprobación
        ownerName: data.ownerName,
        ownerEmail: data.ownerEmail,
        ownerPhone: data.ownerPhone,
      },
    });

    // TODO: Enviar email de confirmación al propietario
    // TODO: Notificar a admin de nuevo registro pendiente

    return NextResponse.json(
      { 
        success: true, 
        message: "Registro enviado para revisión",
        id: restaurant.id 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating restaurant registration:", error);
    return NextResponse.json(
      { error: "Error al procesar el registro" },
      { status: 500 }
    );
  }
}
