import RestaurantForm from "@/components/admin/RestaurantForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-8">Editar Restaurante</h1>
      <RestaurantForm restaurant={restaurant} />
    </div>
  );
}
