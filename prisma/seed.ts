import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  await prisma.user.upsert({
    where: { email: "admin@guiarestaurant.com" },
    update: {},
    create: {
      email: "admin@guiarestaurant.com",
      password: hashedPassword,
      name: "Administrador",
    },
  });

  console.log("Usuario administrador creado:");
  console.log("Email: admin@guiarestaurant.com");
  console.log("Password: admin123");
  console.log("¡IMPORTANTE! Cambia esta contraseña en producción");

  // Crear algunos estados de ejemplo
  const estados = [
    { nombre: "Ciudad de México", codigo: "CDMX" },
    { nombre: "Jalisco", codigo: "JAL" },
    { nombre: "Nuevo León", codigo: "NL" },
  ];

  for (const estado of estados) {
    await prisma.estado.upsert({
      where: { codigo: estado.codigo },
      update: {},
      create: estado,
    });
  }

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
