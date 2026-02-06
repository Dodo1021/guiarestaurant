import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  // Verificar autenticación
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error("Error fetching pending restaurants:", error);
    return NextResponse.json(
      { error: "Error al cargar pendientes" },
      { status: 500 }
    );
  }
}
