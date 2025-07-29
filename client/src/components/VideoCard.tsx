import { PlayCircle } from "lucide-react";
import { type VideoWithStats } from "@shared/schema";
import { formatViews, formatTimeAgo, type Language } from "@/lib/i18n";

interface VideoCardProps {
  video: VideoWithStats;
  rank: number;
  language: Language;
  onPlay: (videoId: string) => void;
}

const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case 'music':
      return 'bg-blue-100 text-blue-800';
    case 'sermon':
      return 'bg-purple-100 text-purple-800';
    case 'other':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'music':
      return '🎵';
    case 'sermon':
      return '✝️';
    case 'other':
      return '📹';
    default:
      return '🎬';
  }
};

export default function VideoCard({ video, rank, language, onPlay }: VideoCardProps) {
  const views = video.stats?.totalViews || 0;
  const publishedDate = new Date(video.publishedAt);

  return (
    <div 
      className="group cursor-pointer" 
      onClick={() => onPlay(video.youtubeId)}
      data-testid={`video-card-${video.id}`}
    >
      <div className="relative">
        <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          #{rank}
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded z-10">
          {video.duration}
        </div>
        <img 
          src={video.thumbnailUrl} 
          alt={video.title} 
          className="w-full h-48 object-cover rounded-lg group-hover:shadow-lg transition-shadow duration-300"
          data-testid={`video-thumbnail-${video.id}`}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
          <PlayCircle className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-start space-x-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(video.category)}`}>
            {getCategoryIcon(video.category)} {video.category}
          </span>
          {video.keywords && video.keywords.length > 0 && (
            <span className="text-gray-500 text-xs truncate">
              {video.keywords.slice(0, 2).join(', ')}
            </span>
          )}
        </div>
        <h3 
          className="font-semibold text-dark mt-2 group-hover:text-primary transition-colors line-clamp-2"
          data-testid={`video-title-${video.id}`}
        >
          {video.title}
        </h3>
        <p 
          className="text-sm text-gray-600 mt-1"
          data-testid={`video-metadata-${video.id}`}
        >
          {formatViews(views, language)} • {formatTimeAgo(publishedDate, language)}
        </p>
      </div>
    </div>
  );
}
