import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { restaurantUpdateSchema } from "@/lib/validations/restaurant";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Solo mostrar restaurantes aprobados y activos en la vista pública
    const restaurant = await prisma.restaurant.findFirst({
      where: { 
        id,
        status: "approved",
        activo: true,
      },
      // Excluir datos sensibles del propietario en respuesta pública
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        facebook: true,
        instagram: true,
        whatsapp: true,
        estado: true,
        municipio: true,
        codigoPostal: true,
        categoria: true,
        precioPromedio: true,
        horarios: true,
        imagenes: true,
        logo: true,
        destacado: true,
        createdAt: true,
        // NO incluir: ownerName, ownerEmail, ownerPhone, status, activo
      },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurante no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al cargar restaurante" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Validar datos
    const validation = restaurantUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: validation.data,
    });

    return NextResponse.json(restaurant);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al actualizar restaurante" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verificar autenticación
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    await prisma.restaurant.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al eliminar restaurante" },
      { status: 500 }
    );
  }
}
