ALTER TABLE "wishlist" ADD COLUMN "uuid1" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" DROP COLUMN IF EXISTS "id";