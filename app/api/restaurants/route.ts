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

    // Parámetros de paginación (con límites de seguridad)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;
    
    // Limitar búsqueda muy profunda (evitar queries pesados)
    if (skip > 10000) {
      return NextResponse.json(
        { error: "Paginación fuera de rango" },
        { status: 400 }
      );
    }

    const where: any = {
      activo: true,
      status: "approved", // Solo mostrar aprobados en la vista pública
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

    // Obtener restaurantes con paginación (excluir datos sensibles del propietario)
    const restaurants = await prisma.restaurant.findMany({
      where,
      take: Math.min(limit, 50), // Máximo 50 por página para evitar abuso
      skip: skip,
      orderBy: [
        { destacado: "desc" },
        { createdAt: "desc" },
      ],
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
        // NO incluir: ownerName, ownerEmail, ownerPhone, status, activo, updatedAt
      },
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
