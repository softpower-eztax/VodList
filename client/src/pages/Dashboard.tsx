import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { type VideoWithStats } from "@shared/schema";
import { type Language, getTranslation } from "@/lib/i18n";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryTabs from "@/components/CategoryTabs";
import StatsCards from "@/components/StatsCards";
import VideoCard from "@/components/VideoCard";
import VideoPopulator from "@/components/VideoPopulator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const { language, setLanguage } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [loadedVideos, setLoadedVideos] = useState<VideoWithStats[]>([]);
  const [lastLoadedCategory, setLastLoadedCategory] = useState<string>("");

  // Fetch categories to set default active category
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    select: (data: any[]) => data || [],
  });

  // Set first category as default when categories load
  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].name);
    }
  }, [categories, activeCategory]);

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats/dashboard"],
    select: (
      data:
        | { totalVideos: number; totalViews: number; categoriesCount: number }
        | undefined,
    ) => data || { totalVideos: 0, totalViews: 0, categoriesCount: 3 },
  });

  // Fetch videos based on active category using real-time search
  const {
    data: fetchedVideos,
    isLoading: videosLoading,
    refetch: refetchVideos,
  } = useQuery({
    queryKey: ["/api/videos/search", activeCategory],
    enabled: false, // Disabled by default - will be triggered by populate button
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache results
    select: (data: VideoWithStats[]) => data || [],
  });

  const handleVideoPlay = (youtubeId: string) => {
    // Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, "_blank");
  };

  const handleLoadMore = () => {
    // TODO: Implement pagination
    console.log("Load more videos");
  };

  // Process videos for display (use loaded videos if they match current category, otherwise empty)
  const displayVideos = React.useMemo(() => {
    const videosToProcess =
      lastLoadedCategory === activeCategory ? loadedVideos : [];

    if (!videosToProcess || videosToProcess.length === 0) return [];

    // Apply search filter
    let filteredVideos = videosToProcess;
    if (searchQuery) {
      filteredVideos = videosToProcess.filter(
        (video) =>
          video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          video.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          video.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "recent":
        return filteredVideos.sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime(),
        );
      case "viewed":
        return filteredVideos.sort(
          (a, b) => (b.stats?.totalViews || 0) - (a.stats?.totalViews || 0),
        );
      case "popular":
      default:
        return filteredVideos;
    }
  }, [loadedVideos, lastLoadedCategory, activeCategory, searchQuery, sortBy]);

  const sortOptions = [
    { value: "recent", labelKey: "most_recent" },
    { value: "popular", labelKey: "most_popular" },

    { value: "viewed", labelKey: "most_viewed" },
  ];

  return (
    <div className="min-h-screen bg-light">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark mb-2">
            {getTranslation("dashboard_title", language)}
          </h1>
          <p className="text-gray-600">
            {getTranslation("dashboard_subtitle", language)}
          </p>
        </div>

        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          language={language}
        />

        {/* Video Populator */}
        <VideoPopulator
          language={language}
          onPopulate={async () => {
            const result = await refetchVideos();
            if (result.data) {
              setLoadedVideos(result.data);
              setLastLoadedCategory(activeCategory);
            }
          }}
        />

        {/* Top Videos Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-dark">
              {getTranslation("top_videos_title", language)} -{" "}
              {getTranslation(activeCategory, language)}
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {getTranslation("sort_by", language)}
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40" data-testid="sort-selector">
                  <SelectValue placeholder={getTranslation("most_recent", language)} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(({ value, labelKey }) => (
                    <SelectItem key={value} value={value}>
                      {getTranslation(labelKey, language)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Videos Grid */}
          {videosLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 w-full h-48 rounded-lg mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : displayVideos && displayVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayVideos.slice(0, 10).map((video, index) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  rank={index + 1}
                  language={language}
                  onPlay={handleVideoPlay}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery
                  ? `No videos found for "${searchQuery}"`
                  : lastLoadedCategory === activeCategory
                    ? "No videos found for this category"
                    : `Click "Load Videos for Category" to load fresh content for ${getTranslation(activeCategory, language)}`}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {displayVideos && displayVideos.length >= 10 && (
            <div className="mt-8 text-center">
              <Button
                onClick={handleLoadMore}
                className="bg-primary hover:bg-red-600 text-white font-medium py-3 px-8"
                data-testid="load-more-button"
              >
                <ChevronDown className="w-4 h-4 mr-2" />
                {getTranslation("load_more", language)}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
    </div>
  );
}
