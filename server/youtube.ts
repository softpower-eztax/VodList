import { storage } from "./storage";
import { type InsertVideo, type Category } from "@shared/schema";

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      high: { url: string };
      maxres?: { url: string };
    };
    publishedAt: string;
    channelTitle: string;
  };
  contentDetails?: {
    duration: string;
  };
  statistics?: {
    viewCount: string;
    likeCount: string;
    commentCount: string;
  };
}

interface YouTubeSearchResponse {
  items: YouTubeVideo[];
}

// Convert ISO 8601 duration to human readable format
function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  
  const hours = parseInt(match[1]?.replace('H', '') || '0');
  const minutes = parseInt(match[2]?.replace('M', '') || '0');
  const seconds = parseInt(match[3]?.replace('S', '') || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

async function searchYouTubeVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  if (!API_KEY) {
    throw new Error('YouTube API key not found');
  }

  try {
    // Search for videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet&type=video&q=${encodeURIComponent(query)}&` +
      `maxResults=${maxResults}&order=relevance&` +
      `safeSearch=strict&regionCode=US&relevanceLanguage=en&` +
      `key=${API_KEY}`;

    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`YouTube search failed: ${searchResponse.statusText}`);
    }

    const searchData: YouTubeSearchResponse = await searchResponse.json();
    
    // Get video details including duration and statistics (view counts)
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?` +
      `part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`;

    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`YouTube details failed: ${detailsResponse.statusText}`);
    }

    const detailsData = await detailsResponse.json();
    
    // Merge search results with details and statistics
    return searchData.items.map((video, index) => ({
      ...video,
      contentDetails: detailsData.items[index]?.contentDetails,
      statistics: detailsData.items[index]?.statistics
    }));

  } catch (error) {
    console.error('Error fetching from YouTube:', error);
    throw error;
  }
}

// Fallback sample data in case YouTube API fails
const sampleYouTubeVideos = {
  music: [
    {
      title: "Amazing Grace - How Sweet the Sound",
      description: "Classic hymn performance with beautiful orchestral arrangement",
      youtubeId: "CDdvReNKKuk",
      thumbnailUrl: "https://img.youtube.com/vi/CDdvReNKKuk/maxresdefault.jpg",
      duration: "4:32",
      publishedAt: new Date("2023-12-15"),
      keywords: ["worship", "hymn", "grace", "classic"]
    },
    {
      title: "10,000 Reasons (Bless the Lord) - Matt Redman",
      description: "Powerful worship song with lyrics that inspire praise",
      youtubeId: "DXDGE_lRI0E",
      thumbnailUrl: "https://img.youtube.com/vi/DXDGE_lRI0E/maxresdefault.jpg",
      duration: "4:14",
      publishedAt: new Date("2023-11-20"),
      keywords: ["praise", "worship", "contemporary", "blessing"]
    },
    {
      title: "How Great Thou Art - Celtic Woman",
      description: "Beautiful rendition of the beloved hymn",
      youtubeId: "gTHy2TZk-WM",
      thumbnailUrl: "https://img.youtube.com/vi/gTHy2TZk-WM/maxresdefault.jpg",
      duration: "5:18",
      publishedAt: new Date("2023-10-10"),
      keywords: ["hymn", "celtic", "greatness", "worship"]
    },
    {
      title: "Oceans (Where Feet May Fail) - Hillsong UNITED",
      description: "Inspiring worship song about faith and trust",
      youtubeId: "dy9nwe9_xzw",
      thumbnailUrl: "https://img.youtube.com/vi/dy9nwe9_xzw/maxresdefault.jpg",
      duration: "8:58",
      publishedAt: new Date("2023-09-25"),
      keywords: ["faith", "trust", "contemporary", "hillsong"]
    },
    {
      title: "Great Are You Lord - All Sons & Daughters",
      description: "Modern worship song celebrating God's greatness",
      youtubeId: "OhL0zMrOSHQ",
      thumbnailUrl: "https://img.youtube.com/vi/OhL0zMrOSHQ/maxresdefault.jpg",
      duration: "5:22",
      publishedAt: new Date("2023-08-12"),
      keywords: ["worship", "praise", "greatness", "contemporary"]
    }
  ],
  sermon: [
    {
      title: "The Power of Faith - Joel Osteen",
      description: "Inspiring message about the transformative power of faith",
      youtubeId: "5Zc3gJJsKxs",
      thumbnailUrl: "https://img.youtube.com/vi/5Zc3gJJsKxs/maxresdefault.jpg",
      duration: "28:45",
      publishedAt: new Date("2023-12-10"),
      keywords: ["faith", "inspiration", "transformation", "hope"]
    },
    {
      title: "Walking in God's Purpose - Joyce Meyer",
      description: "Teaching about discovering and living God's purpose for your life",
      youtubeId: "EXz9hMGV3oU",
      thumbnailUrl: "https://img.youtube.com/vi/EXz9hMGV3oU/maxresdefault.jpg",
      duration: "22:15",
      publishedAt: new Date("2023-11-28"),
      keywords: ["purpose", "calling", "guidance", "ministry"]
    },
    {
      title: "The Grace of God - Charles Stanley",
      description: "Deep teaching on God's amazing grace and mercy",
      youtubeId: "1uPgQ4T3B2k",
      thumbnailUrl: "https://img.youtube.com/vi/1uPgQ4T3B2k/maxresdefault.jpg",
      duration: "35:20",
      publishedAt: new Date("2023-10-15"),
      keywords: ["grace", "mercy", "teaching", "salvation"]
    },
    {
      title: "Overcoming Fear with Faith - TD Jakes",
      description: "Powerful sermon about conquering fear through faith",
      youtubeId: "yTCDVfMz15M",
      thumbnailUrl: "https://img.youtube.com/vi/yTCDVfMz15M/maxresdefault.jpg",
      duration: "42:18",
      publishedAt: new Date("2023-09-05"),
      keywords: ["fear", "faith", "courage", "victory"]
    },
    {
      title: "The Heart of Worship - Francis Chan",
      description: "Teaching on what true worship means to God",
      youtubeId: "PgLe1c0Q8YI",
      thumbnailUrl: "https://img.youtube.com/vi/PgLe1c0Q8YI/maxresdefault.jpg",
      duration: "31:42",
      publishedAt: new Date("2023-08-20"),
      keywords: ["worship", "heart", "devotion", "spirituality"]
    }
  ],
  other: [
    {
      title: "My Testimony - From Darkness to Light",
      description: "Personal testimony of transformation and hope",
      youtubeId: "hFZFjoX2cGg",
      thumbnailUrl: "https://img.youtube.com/vi/hFZFjoX2cGg/maxresdefault.jpg",
      duration: "12:30",
      publishedAt: new Date("2023-12-01"),
      keywords: ["testimony", "transformation", "hope", "personal"]
    },
    {
      title: "Daily Prayer and Devotion Guide",
      description: "Practical guide for developing a strong prayer life",
      youtubeId: "B14nM3OoA7M",
      thumbnailUrl: "https://img.youtube.com/vi/B14nM3OoA7M/maxresdefault.jpg",
      duration: "18:45",
      publishedAt: new Date("2023-11-15"),
      keywords: ["prayer", "devotion", "daily", "spiritual growth"]
    },
    {
      title: "Biblical Wisdom for Modern Life",
      description: "Applying ancient biblical principles to today's challenges",
      youtubeId: "7eCWNkQB-lE",
      thumbnailUrl: "https://img.youtube.com/vi/7eCWNkQB-lE/maxresdefault.jpg",
      duration: "25:10",
      publishedAt: new Date("2023-10-30"),
      keywords: ["wisdom", "biblical", "modern", "application"]
    },
    {
      title: "The Power of Community in Faith",
      description: "Understanding the importance of Christian community",
      youtubeId: "u-1f_MJuy1A",
      thumbnailUrl: "https://img.youtube.com/vi/u-1f_MJuy1A/maxresdefault.jpg",
      duration: "16:22",
      publishedAt: new Date("2023-09-18"),
      keywords: ["community", "fellowship", "church", "unity"]
    },
    {
      title: "Finding Peace in Difficult Times",
      description: "Encouragement and guidance for challenging seasons",
      youtubeId: "m8C0V3K6qP0",
      thumbnailUrl: "https://img.youtube.com/vi/m8C0V3K6qP0/maxresdefault.jpg",
      duration: "20:15",
      publishedAt: new Date("2023-08-28"),
      keywords: ["peace", "difficult times", "encouragement", "comfort"]
    }
  ]
};

export async function populateVideosFromYouTube(): Promise<void> {
  try {
    // Get fresh categories with their current keywords from database
    const categories = await storage.getCategories();
    console.log(`📋 Fetching fresh categories from database... Found ${categories.length} categories`);
    
    for (const category of categories) {
      console.log(`🏷️  Category "${category.name}": keywords = [${category.keywords?.join(', ') || 'none'}]`);
      
      if (!category.keywords || category.keywords.length === 0) {
        console.log(`⚠️  Skipping category "${category.name}" - no keywords defined`);
        continue;
      }

      const categoryName = category.name.toLowerCase();
      
      // Create search query using ONLY the category keywords (AND condition)
      const searchQuery = category.keywords.map(keyword => `+${keyword}`).join(' ');
      console.log(`🔍 Searching YouTube for exact keywords: "${searchQuery}" in category "${category.name}"`);

      try {
        // Search YouTube for videos matching keywords
        const youtubeVideos = await searchYouTubeVideos(searchQuery, 8);
        
        let addedCount = 0;
        for (const video of youtubeVideos) {
          // Check if video already exists
          const existingVideos = await storage.getVideosByCategory(categoryName);
          const exists = existingVideos.some(v => v.youtubeId === video.id.videoId);
          
          if (!exists) {
            const insertVideo: InsertVideo = {
              title: video.snippet.title,
              description: video.snippet.description?.substring(0, 500) || '',
              youtubeId: video.id.videoId,
              thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
              duration: video.contentDetails ? parseDuration(video.contentDetails.duration) : '0:00',
              category: categoryName,
              keywords: category.keywords,
              publishedAt: new Date(video.snippet.publishedAt)
            };
            
            const createdVideo = await storage.createVideo(insertVideo);
            
            // Create initial stats using real YouTube view count
            const realViewCount = parseInt(video.statistics?.viewCount || '0');
            console.log(`📊 Video "${video.snippet.title}" has ${realViewCount.toLocaleString()} views on YouTube`);
            await storage.createVideoStats({
              videoId: createdVideo.id,
              totalViews: realViewCount,
              weeklyViews: Math.floor(realViewCount * 0.1), // Estimate 10% of total as weekly
              monthlyViews: Math.floor(realViewCount * 0.3), // Estimate 30% of total as monthly
            });
            
            addedCount++;
            console.log(`✅ Added YouTube video "${video.snippet.title}" to category "${category.name}"`);
          } else {
            console.log(`⏭️  Video "${video.snippet.title}" already exists in category "${category.name}"`);
          }
        }
        
        console.log(`📊 Added ${addedCount} new videos to category "${category.name}"`);
        
      } catch (youtubeError) {
        console.error(`❌ YouTube API error for category "${category.name}":`, youtubeError);
        console.log(`⚠️  Skipping category "${category.name}" - YouTube search failed`);
      }
    }
    
    console.log('✅ Videos populated from YouTube API based on category keywords');
  } catch (error) {
    console.error('❌ Error populating videos:', error);
  }
}

// Real-time YouTube search by keywords (no database storage)
export async function searchYouTubeByKeywords(keywords: string[], maxResults: number = 10): Promise<any[]> {
  try {
    if (!keywords || keywords.length === 0) {
      return [];
    }

    // Build search query with AND logic using + prefix
    const searchQuery = keywords.map(keyword => `+${keyword.trim()}`).join(' ');
    console.log(`🔍 Real-time YouTube search: "${searchQuery}"`);
    
    const youtubeVideos = await searchYouTubeVideos(searchQuery, maxResults);
    
    // Transform YouTube data to match frontend expectations
    const transformedVideos = youtubeVideos.map(video => ({
      id: `temp_${video.id.videoId}`, // Temporary ID for real-time results
      title: video.snippet.title,
      description: video.snippet.description,
      youtubeId: video.id.videoId,
      thumbnailUrl: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high.url,
      duration: video.contentDetails ? parseDuration(video.contentDetails.duration) : "0:00",
      publishedAt: video.snippet.publishedAt,
      stats: {
        id: `temp_stats_${video.id.videoId}`,
        videoId: `temp_${video.id.videoId}`,
        totalViews: parseInt(video.statistics?.viewCount || '0'),
        weeklyViews: Math.floor(parseInt(video.statistics?.viewCount || '0') * 0.1),
        monthlyViews: Math.floor(parseInt(video.statistics?.viewCount || '0') * 0.3),
        lastUpdated: new Date().toISOString()
      },
      keywords: keywords,
      category: '', // Will be set by the API endpoint
      createdAt: new Date().toISOString(),
      isActive: true
    }));

    console.log(`📊 Found ${transformedVideos.length} real-time results`);
    return transformedVideos;
    
  } catch (error) {
    console.error('❌ Real-time YouTube search error:', error);
    return [];
  }
}

export async function refreshVideoStats(): Promise<void> {
  try {
    const videos = await storage.getVideos();
    
    for (const video of videos) {
      if (video.stats) {
        // Simulate view count updates
        const additionalViews = Math.floor(Math.random() * 100);
        await storage.updateVideoStats(video.id, {
          totalViews: (video.stats.totalViews || 0) + additionalViews,
          weeklyViews: Math.floor(Math.random() * 500) + 50,
          monthlyViews: Math.floor(Math.random() * 2000) + 200,
        });
      }
    }
    
    console.log('✅ Video stats refreshed');
  } catch (error) {
    console.error('❌ Error refreshing video stats:', error);
  }
}