import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Play } from "lucide-react";
import { type FavorVideo } from "@shared/schema";

export default function FavorPage() {
  const { data: favorVideos, isLoading } = useQuery<FavorVideo[]>({
    queryKey: ["/api/favor-videos"],
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading favorite videos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Favorite Videos</h1>
        <p className="text-gray-600">Browse your curated collection of favorite videos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorVideos?.map((video) => (
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
    </div>
  );
}