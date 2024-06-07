import { InferSelectModel, relations } from 'drizzle-orm';
import { decimal, pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	picture: text('picture'),
	createdAt: text('created_at').notNull(),
});

export type IUser = InferSelectModel<typeof users>;

export const rooms = pgTable('rooms', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
		}),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
	amenities: text('amenities').array().notNull(),
	listingUrl: text('listing_url').notNull(),
	thumbnail: text('thumbnail').notNull(),
	rating: decimal('rating').notNull(),
	summary: text('summary').notNull(),
	propertyType: text('property_type').notNull(),
	address: text('address').notNull(),
});

export type IRoom = InferSelectModel<typeof rooms>;

// export const roomsRelations = relations(rooms, ({ one, many }) => ({
// 	user: one(users, { fields: [rooms.userId], references: [users.id] }),
// 	images: many(images),
// 	bookings: many(bookings),
// 	wishlists: many(wishlists),
// }));

export const prices = pgTable('prices', {
	id: text('id').primaryKey(),
	roomId: text('room_id')
		.notNull()
		.references(() => rooms.id, { onDelete: 'cascade' }),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
	discountedPrice: decimal('discounted_price').notNull(),
	originalPrice: decimal('original_price').notNull(),
	serviceCharge: decimal('service_charge').notNull(),
});

export type IPrice = InferSelectModel<typeof prices>;

export const images = pgTable('images', {
	id: text('id').primaryKey(),
	roomId: text('room_id')
		.notNull()
		.references(() => rooms.id, { onDelete: 'cascade' }),
	url: text('url').notNull().unique(),
	createdAt: text('created_at').notNull(),
});

export type Image = InferSelectModel<typeof images>;

export const wishlists = pgTable('wishlist', {
	id: text('id').primaryKey(),
	roomId: text('room_id')
		.notNull()
		.references(() => rooms.id, {
			onDelete: 'cascade',
		}),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('created_at').notNull(),
});

export const bookings = pgTable('bookings', {
	id: text('id').primaryKey(),
	userId: text('user_id').notNull(),
	roomId: text('room_id').notNull(),
	checkIn: text('booking_start_date').notNull(),
	checkOut: text('booking_end_date').notNull(),
	status: text('booking_status').notNull(),
	price: text('booking_price').notNull(),
	currency: text('currency').notNull(),
	createdAt: text('created_at').notNull(),
	modifiedAt: text('modified_at').notNull(),
});

export const insertWishlistSchema = createInsertSchema(wishlists);
export const insertUserSchema = createInsertSchema(users);
export const insertImagesSchema = createInsertSchema(images);
export const insertRoomsSchema = createInsertSchema(rooms);
export const insertBookingsSchema = createInsertSchema(bookings);

export const wishlistRelations = relations(wishlists, ({ one, many }) => ({
	user: one(users, { fields: [wishlists.userId], references: [users.id] }),
	room: one(rooms, { fields: [wishlists.roomId], references: [rooms.id] }),
}));

export const bookingRelations = relations(bookings, ({ one, many }) => ({
	user: one(users, { fields: [bookings.userId], references: [users.id] }),
	room: one(rooms, {
		fields: [bookings.roomId],
		references: [rooms.id],
	}),
	images: many(images),
}));

export const imageRelations = relations(images, ({ one }) => ({
	room: one(rooms, { fields: [images.roomId], references: [rooms.id] }),
	bookings: one(bookings, { fields: [images.roomId], references: [bookings.roomId] }),
}));

export const priceRelations = relations(prices, ({ one }) => ({
	room: one(rooms, { fields: [prices.roomId], references: [rooms.id] }),
}));

export const userRelations = relations(users, ({ one, many }) => ({
	rooms: many(rooms),
	bookings: many(bookings),
	wishlists: many(wishlists),
}));

export const roomRelations = relations(rooms, ({ one, many }) => ({
	images: many(images),
	price: one(prices, { fields: [rooms.id], references: [prices.roomId] }),
	bookings: many(bookings),
	wishlists: many(wishlists),
	user: one(users, { fields: [rooms.userId], references: [users.id] }),
}));
