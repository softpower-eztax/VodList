import {
  users,
  videos,
  categories,
  videoStats,
  groups,
  favorVideos,
  type Video,
  type Category,
  type VideoStats,
  type InsertVideo,
  type InsertCategory,
  type InsertVideoStats,
  type VideoWithStats,
  type User,
  type InsertUser,
  type Group,
  type InsertGroup,
  type FavorVideo,
  type InsertFavorVideo,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, inArray } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Video methods
  getVideos(): Promise<VideoWithStats[]>;
  getVideoById(id: string): Promise<VideoWithStats | undefined>;
  getVideosByCategory(category: string): Promise<VideoWithStats[]>;
  getTopVideosByCategory(
    category: string,
    limit: number,
  ): Promise<VideoWithStats[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(
    id: string,
    video: Partial<InsertVideo>,
  ): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(
    id: string,
    category: Partial<InsertCategory>,
  ): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Stats methods
  getVideoStats(videoId: string): Promise<VideoStats | undefined>;
  updateVideoStats(
    videoId: string,
    stats: Partial<InsertVideoStats>,
  ): Promise<VideoStats | undefined>;
  createVideoStats(stats: InsertVideoStats): Promise<VideoStats>;
  getTopVideos(limit: number): Promise<VideoWithStats[]>;
  getDashboardStats(): Promise<{
    totalVideos: number;
    totalViews: number;
    categoriesCount: number;
  }>;

  // Group methods
  getGroups(): Promise<Group[]>;
  getGroupsByType(type: string): Promise<Group[]>;
  createGroup(group: InsertGroup): Promise<Group>;
  updateGroup(id: string, group: Partial<InsertGroup>): Promise<Group | undefined>;
  deleteGroup(id: string): Promise<boolean>;

  // FavorVideo methods
  getFavorVideos(): Promise<FavorVideo[]>;
  getFavorVideoById(id: string): Promise<FavorVideo | undefined>;
  createFavorVideo(favorVideo: InsertFavorVideo): Promise<FavorVideo>;
  updateFavorVideo(id: string, favorVideo: Partial<InsertFavorVideo>): Promise<FavorVideo | undefined>;
  deleteFavorVideo(id: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Video methods
  async getVideos(): Promise<VideoWithStats[]> {
    const result = await db
      .select()
      .from(videos)
      .leftJoin(videoStats, eq(videos.id, videoStats.videoId))
      .where(eq(videos.isActive, true))
      .orderBy(desc(videos.createdAt));

    return result.map((row) => ({
      ...row.videos,
      stats: row.video_stats || undefined,
    }));
  }

  async getVideoById(id: string): Promise<VideoWithStats | undefined> {
    const result = await db
      .select()
      .from(videos)
      .leftJoin(videoStats, eq(videos.id, videoStats.videoId))
      .where(and(eq(videos.id, id), eq(videos.isActive, true)));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.videos,
      stats: row.video_stats || undefined,
    };
  }

  async getVideosByCategory(category: string): Promise<VideoWithStats[]> {
    const result = await db
      .select()
      .from(videos)
      .leftJoin(videoStats, eq(videos.id, videoStats.videoId))
      .where(and(eq(videos.category, category), eq(videos.isActive, true)))
      .orderBy(desc(videos.createdAt));

    return result.map((row) => ({
      ...row.videos,
      stats: row.video_stats || undefined,
    }));
  }

  async getTopVideosByCategory(
    category: string,
    limit: number,
  ): Promise<VideoWithStats[]> {
    console.log(
      "Fetching top videos for category:",
      category,
      "limit:",
      limit,
      category,
    );

    const result = await db
      .select()
      .from(videos)
      .leftJoin(videoStats, eq(videos.id, videoStats.videoId))
      .where(and(eq(videos.category, category), eq(videos.isActive, true)))
      .orderBy(desc(sql`COALESCE(${videoStats.totalViews}, 0)`))
      .limit(limit);

    return result.map((row) => ({
      ...row.videos,
      stats: row.video_stats || undefined,
    }));
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db.insert(videos).values(video).returning();
    return newVideo;
  }

  async updateVideo(
    id: string,
    video: Partial<InsertVideo>,
  ): Promise<Video | undefined> {
    const [updatedVideo] = await db
      .update(videos)
      .set(video)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo || undefined;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db
      .update(videos)
      .set({ isActive: false })
      .where(eq(videos.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryByName(name: string): Promise<Category | undefined> {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, name));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async updateCategory(
    id: string,
    category: Partial<InsertCategory>,
  ): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Stats methods
  async getVideoStats(videoId: string): Promise<VideoStats | undefined> {
    const [stats] = await db
      .select()
      .from(videoStats)
      .where(eq(videoStats.videoId, videoId));
    return stats || undefined;
  }

  async updateVideoStats(
    videoId: string,
    stats: Partial<InsertVideoStats>,
  ): Promise<VideoStats | undefined> {
    const [updatedStats] = await db
      .update(videoStats)
      .set({ ...stats, lastUpdated: new Date() })
      .where(eq(videoStats.videoId, videoId))
      .returning();
    return updatedStats || undefined;
  }

  async createVideoStats(stats: InsertVideoStats): Promise<VideoStats> {
    const [newStats] = await db.insert(videoStats).values(stats).returning();
    return newStats;
  }

  async getTopVideos(limit: number): Promise<VideoWithStats[]> {
    const result = await db
      .select()
      .from(videos)
      .leftJoin(videoStats, eq(videos.id, videoStats.videoId))
      .where(eq(videos.isActive, true))
      .orderBy(desc(sql`COALESCE(${videoStats.totalViews}, 0)`))
      .limit(limit);

    return result.map((row) => ({
      ...row.videos,
      stats: row.video_stats || undefined,
    }));
  }

  async getDashboardStats(): Promise<{
    totalVideos: number;
    totalViews: number;
    categoriesCount: number;
  }> {
    const [videoCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(videos)
      .where(eq(videos.isActive, true));

    const [viewsTotal] = await db
      .select({
        total: sql<number>`COALESCE(sum(${videoStats.totalViews}), 0)`,
      })
      .from(videoStats);

    const [categoryCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories);

    return {
      totalVideos: videoCount.count,
      totalViews: viewsTotal.total,
      categoriesCount: categoryCount.count,
    };
  }

  // Group methods
  async getGroups(): Promise<Group[]> {
    return await db.select().from(groups);
  }

  async getGroupsByType(type: string): Promise<Group[]> {
    return await db.select().from(groups).where(eq(groups.groupName, type));
  }

  async createGroup(insertGroup: InsertGroup): Promise<Group> {
    const [group] = await db.insert(groups).values(insertGroup).returning();
    return group;
  }

  async updateGroup(id: string, updateGroup: Partial<InsertGroup>): Promise<Group | undefined> {
    const [group] = await db
      .update(groups)
      .set(updateGroup)
      .where(eq(groups.id, id))
      .returning();
    return group || undefined;
  }

  async deleteGroup(id: string): Promise<boolean> {
    const result = await db.delete(groups).where(eq(groups.id, id));
    return (result.rowCount || 0) > 0;
  }

  // FavorVideo methods
  async getFavorVideos(): Promise<FavorVideo[]> {
    return await db.select().from(favorVideos);
  }

  async getFavorVideoById(id: string): Promise<FavorVideo | undefined> {
    const [favorVideo] = await db.select().from(favorVideos).where(eq(favorVideos.id, id));
    return favorVideo || undefined;
  }

  async createFavorVideo(insertFavorVideo: InsertFavorVideo): Promise<FavorVideo> {
    const [favorVideo] = await db.insert(favorVideos).values(insertFavorVideo).returning();
    return favorVideo;
  }

  async updateFavorVideo(id: string, updateFavorVideo: Partial<InsertFavorVideo>): Promise<FavorVideo | undefined> {
    const [favorVideo] = await db
      .update(favorVideos)
      .set(updateFavorVideo)
      .where(eq(favorVideos.id, id))
      .returning();
    return favorVideo || undefined;
  }

  async deleteFavorVideo(id: string): Promise<boolean> {
    const result = await db.delete(favorVideos).where(eq(favorVideos.id, id));
    return (result.rowCount || 0) > 0;
  }
}

export const storage = new DatabaseStorage();
