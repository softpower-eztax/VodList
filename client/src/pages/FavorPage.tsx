import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Play, Filter, Heart, Home, Settings } from "lucide-react";
import { Link } from "wouter";
import { type FavorVideo, type Group } from "@shared/schema";

export default function FavorPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  const { data: favorVideos, isLoading } = useQuery<FavorVideo[]>({
    queryKey: ["/api/favor-videos"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/groups", "Category"],
    queryFn: async () => {
      const response = await fetch("/api/groups/type/Category");
      return response.json() as Promise<Group[]>;
    },
  });

  const { data: types } = useQuery({
    queryKey: ["/api/groups", "Type"],
    queryFn: async () => {
      const response = await fetch("/api/groups/type/Type");
      return response.json() as Promise<Group[]>;
    },
  });

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getThumbnailUrl = (youtubeUrl: string): string => {
    const videoId = extractVideoId(youtubeUrl);
    return videoId 
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "/placeholder-video.jpg";
  };

  // Filter videos based on selected category and type
  const filteredVideos = favorVideos?.filter((video) => {
    const categoryMatch = selectedCategory === "all" || video.category === selectedCategory;
    const typeMatch = selectedType === "all" || video.type === selectedType;
    return categoryMatch && typeMatch;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading favorite videos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Navigation Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Favorite Videos</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" data-testid="nav-dashboard">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="outline" size="sm" data-testid="nav-admin">
                <Settings className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-600">Browse your curated collection of favorite videos.</p>
        
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="min-w-[200px]">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.groupType}>
                      {category.groupType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="min-w-[200px]">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger data-testid="select-type-filter">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types?.map((type) => (
                    <SelectItem key={type.id} value={type.groupType}>
                      {type.groupType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(selectedCategory !== "all" || selectedType !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedType("all");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Results count */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredVideos?.length || 0} of {favorVideos?.length || 0} videos
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVideos?.map((video) => (
          <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow" data-testid={`card-video-${video.id}`}>
            <div className="relative aspect-video bg-gray-200">
              <img
                src={getThumbnailUrl(video.youTubeLink)}
                alt={video.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/320x180?text=Video+Thumbnail";
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center group">
                <Button
                  variant="secondary"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => window.open(video.youTubeLink, "_blank")}
                  data-testid={`button-play-${video.id}`}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Watch
                </Button>
              </div>
            </div>
            
            <CardHeader className="pb-3">
              <CardTitle className="text-lg line-clamp-2" title={video.title}>
                {video.title}
              </CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {video.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {video.type}
                </Badge>
              </div>
            </CardHeader>
            
            {video.description && (
              <CardContent className="pt-0">
                <CardDescription className="line-clamp-3">
                  {video.description}
                </CardDescription>
              </CardContent>
            )}
            
            <CardContent className="pt-0 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => window.open(video.youTubeLink, "_blank")}
                data-testid={`button-view-${video.id}`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Watch on YouTube
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {favorVideos?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold mb-2">No favorite videos yet</h3>
          <p className="text-gray-500">
            Start adding your favorite videos through the admin panel to see them here.
          </p>
        </div>
      )}

      {favorVideos && favorVideos.length > 0 && filteredVideos?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No videos match your filters</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your category or type filters to see more videos.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedType("all");
            }}
            data-testid="button-clear-filters-empty"
          >
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}