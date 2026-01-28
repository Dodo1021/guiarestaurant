import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { restaurantCreateSchema } from "@/lib/validations/restaurant";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estado = searchParams.get("estado");
    const municipio = searchParams.get("municipio");
    const search = searchParams.get("search");

    // Parámetros de paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {
      activo: true,
    };

    if (estado) {
      where.estado = {
        contains: estado,
        mode: "insensitive",
      };
    }

    if (municipio) {
      where.municipio = {
        contains: municipio,
        mode: "insensitive",
      };
    }

    if (search) {
      where.name = {
        contains: search,
        mode: "insensitive",
      };
    }

    // Obtener total de resultados para paginación
    const total = await prisma.restaurant.count({ where });

    // Obtener restaurantes con paginación
    const restaurants = await prisma.restaurant.findMany({
      where,
      take: limit,
      skip: skip,
      orderBy: [
        { destacado: "desc" },
        { createdAt: "desc" },
      ],
    });

    // Retornar con metadata de paginación
    return NextResponse.json({
      restaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + restaurants.length < total,
      }
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return NextResponse.json(
      { error: "Error al cargar restaurantes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Verificar autenticación
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // Validar datos
    const validation = restaurantCreateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: validation.data,
    });

    return NextResponse.json(restaurant, { status: 201 });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return NextResponse.json(
      { error: "Error al crear restaurante" },
      { status: 500 }
    );
  }
}
