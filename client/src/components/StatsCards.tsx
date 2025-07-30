import { PlayCircle, Eye, Folder } from "lucide-react";
import { getTranslation, type Language } from "@/lib/i18n";

interface StatsCardsProps {
  stats: {
    totalVideos: number;
    totalViews: number;
    categoriesCount: number;
  };
  language: Language;
}

export default function StatsCards({ stats, language }: StatsCardsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const cards = [
    {
      key: "total_videos",
      value: formatNumber(stats.totalVideos),
      icon: PlayCircle,
      iconBg: "bg-primary bg-opacity-10",
      iconColor: "text-primary",
      growth: "+12%",
      growthText: "from last month",
    },
    {
      key: "total_views",
      value: formatNumber(stats.totalViews),
      icon: Eye,
      iconBg: "bg-secondary bg-opacity-10",
      iconColor: "text-secondary",
      growth: "+8%",
      growthText: "from last week",
    },
    {
      key: "categories_count",
      value: stats.categoriesCount.toString(),
      icon: Folder,
      iconBg: "bg-yellow-500 bg-opacity-10",
      iconColor: "text-yellow-600",
      growth: null,
      growthText: "Music, Sermons, Other",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map(
        ({ key, value, icon: Icon, iconBg, iconColor, growth, growthText }) => (
          <div
            key={key}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            data-testid={`stats-card-${key}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {getTranslation(key, language)}
                </p>
                <p
                  className="text-3xl font-bold text-dark"
                  data-testid={`stats-value-${key}`}
                >
                  {value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`${iconColor} text-xl`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {growth && (
                <span className="text-green-600 font-medium">{growth}</span>
              )}
              <span className={`text-gray-600 ${growth ? "ml-2" : ""}`}>
                {growthText}
              </span>
            </div>
          </div>
        ),
      )}
    </div>
  );
}
