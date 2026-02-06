import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
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
    const { status } = body;

    // Validar status
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido. Debe ser 'approved' o 'rejected'" },
        { status: 400 }
      );
    }

    // Verificar que el restaurante existe
    const existing = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Restaurante no encontrado" },
        { status: 404 }
      );
    }

    if (status === "rejected") {
      // Si es rechazado, eliminamos el registro
      await prisma.restaurant.delete({
        where: { id },
      });

      return NextResponse.json({ 
        success: true, 
        message: "Restaurante rechazado y eliminado" 
      });
    }

    // Si es aprobado, actualizamos el status
    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: { status: "approved" },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Restaurante aprobado",
      restaurant 
    });
  } catch (error) {
    console.error("Error updating restaurant status:", error);
    return NextResponse.json(
      { error: "Error al actualizar el status" },
      { status: 500 }
    );
  }
}
