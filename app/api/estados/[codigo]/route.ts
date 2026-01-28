import { NextRequest, NextResponse } from "next/server";
import { getMunicipiosByEstado, getEstadoByCodigo } from "@/lib/estados-municipios";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    const estado = getEstadoByCodigo(codigo);

    if (!estado) {
      return NextResponse.json(
        { error: "Estado no encontrado" },
        { status: 404 }
      );
    }

    const municipios = getMunicipiosByEstado(codigo);

    return NextResponse.json({
      estado: {
        codigo: estado.codigo,
        nombre: estado.nombre,
      },
      municipios: municipios.map((m) => m.nombre),
    });
  } catch (error) {
    console.error("Error getting municipios:", error);
    return NextResponse.json(
      { error: "Error al cargar municipios" },
      { status: 500 }
    );
  }
}
