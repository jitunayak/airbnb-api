import { z } from 'zod';

export const IRoomInputSchema = z.object({
	name: z.string(),
	description: z.string(),
	userId: z.string(),
	amenities: z.array(z.string()),
	listingUrl: z.string().optional(),
	thumbnail: z.string().optional(),
	summary: z.string(),
	propertyType: z.string(),
	address: z.string(),
	price: z.string(),
	images: z.array(z.string()),
});
