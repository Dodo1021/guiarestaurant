import { z } from 'zod';

export const restaurantCreateSchema = z.object({
  name: z.string().min(1, "Nombre es requerido").max(200, "Nombre muy largo"),
  description: z.string().max(1000, "Descripción muy larga").optional(),
  address: z.string().min(1, "Dirección es requerida").max(500),
  phone: z.string()
    .min(10, "Teléfono inválido")
    .regex(/^[\d\s\-\(\)\+]+$/, "Teléfono contiene caracteres inválidos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),

  estado: z.string().min(1, "Estado es requerido"),
  municipio: z.string().min(1, "Municipio es requerido"),
  codigoPostal: z.string().max(10).optional(),

  categoria: z.array(z.string()).max(10, "Máximo 10 categorías"),
  precioPromedio: z.string().optional(),

  website: z.string().url("URL inválida").optional().or(z.literal("")),
  facebook: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram: z.string().url("URL inválida").optional().or(z.literal("")),
  whatsapp: z.string().optional(),

  imagenes: z.array(z.string().url("URL de imagen inválida")).max(20, "Máximo 20 imágenes"),
  logo: z.string().url("URL de logo inválida").optional().or(z.literal("")),

  destacado: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export const restaurantUpdateSchema = restaurantCreateSchema.partial();

export type RestaurantCreate = z.infer<typeof restaurantCreateSchema>;
export type RestaurantUpdate = z.infer<typeof restaurantUpdateSchema>;
