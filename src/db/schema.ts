import { InferSelectModel } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	createdAt: text('created_at').notNull(),
});

export type User = InferSelectModel<typeof users>;

export const rooms = pgTable('rooms', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	basePrice: text('base_price').notNull(),
	currency: text('currency').notNull(),
	description: text('description').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade',
		}),
	createdAt: text('created_at').notNull(),
	updatedAt: text('updated_at').notNull(),
});

export type Room = InferSelectModel<typeof rooms>;

// export const roomsRelations = relations(rooms, ({ one, many }) => ({
// 	user: one(users, { fields: [rooms.userId], references: [users.id] }),
// 	images: many(images),
// 	bookings: many(bookings),
// 	wishlists: many(wishlists),
// }));

export const images = pgTable('images', {
	id: text('id').primaryKey(),
	roomId: text('room_id').notNull(),
	url: text('url').notNull().unique(),
	createdAt: text('created_at').notNull(),
});

export type Image = InferSelectModel<typeof images>;

export const wishlists = pgTable('wishlist', {
	id: text('id').primaryKey(),
	roomId: text('room_id')
		.notNull()
		.references(() => rooms.id),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
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
});

// export const insertWishlistSchema = createInsertSchema(wishlists);
export const insertUserSchema = createInsertSchema(users);
// export const insertImagesSchema = createInsertSchema(images);
// export const insertRoomsSchema = createInsertSchema(rooms);
// export const insertBookingsSchema = createInsertSchema(bookings);

// export const wishlistRelations = relations(wishlists, ({ one, many }) => ({
// 	user: one(users, { fields: [wishlists.userId], references: [users.id] }),
// 	wishlists: many(wishlists),
// }));

// export const bookingRelations = relations(bookings, ({ one, many }) => ({
// 	user: one(users, { fields: [bookings.userId], references: [users.id] }),
// 	room: one(rooms, { fields: [bookings.roomId], references: [rooms.id] }),
// 	bookings: many(bookings),
// }));

// export const roomRelations = relations(rooms, ({ one, many }) => ({
// 	user: one(users, { fields: [rooms.userId], references: [users.id] }),
// 	images: many(images),
// 	bookings: many(bookings),
// 	wishlists: many(wishlists),
// }));
