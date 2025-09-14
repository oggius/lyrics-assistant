import { pgTable, uuid, varchar, text, integer, timestamp, index } from 'drizzle-orm/pg-core';

export const songs = pgTable('songs', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  author: varchar('author', { length: 255 }),
  lyrics: text('lyrics').notNull(),
  scrollStartDelay: integer('scroll_start_delay').default(0).notNull(),
  scrollSpeed: integer('scroll_speed').default(5).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  titleIdx: index('idx_songs_title').on(table.title),
  authorIdx: index('idx_songs_author').on(table.author),
}));

export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;

// Validation utilities
export const validateScrollSpeed = (speed: number): boolean => {
  return Number.isInteger(speed) && speed >= 1 && speed <= 10;
};

export const validateScrollStartDelay = (delay: number): boolean => {
  return Number.isInteger(delay) && delay >= 0;
};

// Default values
export const DEFAULT_SCROLL_SPEED = 5;
export const DEFAULT_SCROLL_START_DELAY = 0;