import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name'),
	email: text('email').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wishlists = pgTable('wishlist', {
	id: text('id').primaryKey(),
	roomId: text('room_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wishlistRelations = relations(wishlists, ({ one, many }) => ({
	user: one(users, { fields: [wishlists.userId], references: [users.id] }),
}));
