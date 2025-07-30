import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVideoSchema, insertCategorySchema, insertVideoStatsSchema } from "@shared/schema";
import { populateVideosFromYouTube, refreshVideoStats } from "./youtube";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get videos by category
  app.get("/api/videos/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const videos = await storage.getVideosByCategory(category);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos by category" });
    }
  });

  // Get top videos by category
  app.get("/api/videos/top/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const videos = await storage.getTopVideosByCategory(category, limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top videos" });
    }
  });

  // Real-time search videos by category keywords
  app.get("/api/videos/search/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get category and its keywords
      const categoryData = await storage.getCategoryByName(category);
      if (!categoryData || !categoryData.keywords || categoryData.keywords.length === 0) {
        return res.json([]); // Return empty array if no keywords
      }
      
      // Search YouTube in real-time using category keywords
      const { searchYouTubeByKeywords } = await import("./youtube");
      const videos = await searchYouTubeByKeywords(categoryData.keywords, limit);
      
      res.json(videos);
    } catch (error) {
      console.error("Real-time search error:", error);
      res.status(500).json({ message: "Failed to search videos in real-time" });
    }
  });

  // Get overall top videos
  app.get("/api/videos/top", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const videos = await storage.getTopVideos(limit);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top videos" });
    }
  });

  // Get single video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideoById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Create video
  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Update video
  app.patch("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVideoSchema.partial().parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Delete video
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteVideo(id);
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create category
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category
  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete category
  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteCategory(id);
      if (!success) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Get dashboard stats
  app.get("/api/stats/dashboard", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Update video stats
  app.patch("/api/stats/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      const validatedData = insertVideoStatsSchema.partial().parse(req.body);
      
      // Try to update existing stats first
      let stats = await storage.updateVideoStats(videoId, validatedData);
      
      // If no stats exist, create them
      if (!stats && validatedData.totalViews !== undefined) {
        stats = await storage.createVideoStats({
          videoId,
          totalViews: validatedData.totalViews,
          weeklyViews: validatedData.weeklyViews || 0,
          monthlyViews: validatedData.monthlyViews || 0,
        });
      }
      
      if (!stats) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(stats);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid stats data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update video stats" });
    }
  });

  // Populate videos from YouTube
  app.post("/api/videos/populate", async (req, res) => {
    try {
      await populateVideosFromYouTube();
      res.json({ message: "Videos populated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to populate videos" });
    }
  });

  // Refresh video stats
  app.post("/api/videos/refresh-stats", async (req, res) => {
    try {
      await refreshVideoStats();
      res.json({ message: "Video stats refreshed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to refresh video stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
