import { NextResponse } from "next/server";
import { getEstados } from "@/lib/estados-municipios";

export async function GET() {
  try {
    const estados = getEstados();

    // Return simplified format for easier use in dropdowns
    const estadosSimplificados = estados.map((estado) => ({
      codigo: estado.codigo,
      nombre: estado.nombre,
    }));

    return NextResponse.json(estadosSimplificados);
  } catch (error) {
    console.error("Error getting estados:", error);
    return NextResponse.json(
      { error: "Error al cargar estados" },
      { status: 500 }
    );
  }
}
