CREATE TABLE IF NOT EXISTS "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"room_id" text NOT NULL,
	"booking_start_date" text NOT NULL,
	"booking_end_date" text NOT NULL,
	"booking_status" text NOT NULL,
	"booking_price" text NOT NULL,
	"currency" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"url" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "images_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"base_price" text NOT NULL,
	"currency" text NOT NULL,
	"description" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" text NOT NULL,
	"updated_at" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"created_at" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" text PRIMARY KEY NOT NULL,
	"room_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
