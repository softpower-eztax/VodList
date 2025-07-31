import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  youtubeId: text("youtube_id").notNull().unique(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: text("duration").notNull(),
  viewCount: integer("view_count").default(0),
  category: text("category").notNull(),
  keywords: text("keywords").array().default([]),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
  isActive: boolean("is_active").default(true),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  description: text("description"),
  keywords: text("keywords").array().default([]),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const videoStats = pgTable("video_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id),
  totalViews: integer("total_views").default(0),
  weeklyViews: integer("weekly_views").default(0),
  monthlyViews: integer("monthly_views").default(0),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

export const videosRelations = relations(videos, ({ one }) => ({
  stats: one(videoStats, {
    fields: [videos.id],
    references: [videoStats.videoId],
  }),
}));

export const videoStatsRelations = relations(videoStats, ({ one }) => ({
  video: one(videos, {
    fields: [videoStats.videoId],
    references: [videos.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  videos: many(videos),
}));

// Group table for categories and types
export const groups = pgTable("groups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  groupName: varchar("group_name", { length: 100 }).notNull(),
  groupType: varchar("group_type", { length: 100 }).notNull(),
  groupValue: integer("group_value").notNull(),
});

// FavorVideo table for favorite videos
export const favorVideos = pgTable("favor_videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 100 }).notNull(),
  youTubeLink: varchar("youtube_link", { length: 100 }).notNull(),
  description: varchar("description", { length: 200 }),
  category: varchar("category", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoSchema = createInsertSchema(videos).pick({
  title: true,
  description: true,
  youtubeId: true,
  thumbnailUrl: true,
  duration: true,
  category: true,
  keywords: true,
  publishedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  description: true,
  keywords: true,
});

export const insertVideoStatsSchema = createInsertSchema(videoStats).pick({
  videoId: true,
  totalViews: true,
  weeklyViews: true,
  monthlyViews: true,
});

export const insertGroupSchema = createInsertSchema(groups).pick({
  groupName: true,
  groupType: true,
  groupValue: true,
});

export const insertFavorVideoSchema = createInsertSchema(favorVideos).pick({
  title: true,
  youTubeLink: true,
  description: true,
  category: true,
  type: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertVideoStats = z.infer<typeof insertVideoStatsSchema>;
export type VideoStats = typeof videoStats.$inferSelect;

export type VideoWithStats = Video & {
  stats?: VideoStats;
};

export type InsertGroup = z.infer<typeof insertGroupSchema>;
export type Group = typeof groups.$inferSelect;

export type InsertFavorVideo = z.infer<typeof insertFavorVideoSchema>;
export type FavorVideo = typeof favorVideos.$inferSelect;
