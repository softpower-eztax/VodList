interface Translations {
  en: Record<string, string>;
  es: Record<string, string>;
  ko: Record<string, string>;
}

export const translations: Translations = {
  en: {
    // Header
    dashboard: "Dashboard",
    browse: "Browse",
    categories: "Categories",
    favorites: "Favorites",
    search_placeholder: "Search videos...",

    // Dashboard
    dashboard_title: "Top Videos Dashboard",
    dashboard_subtitle: "Discover the most popular videos across all categories",
    all_categories: "All Categories",
    music: "Music",
    sermons: "Sermons",
    other: "Other",

    // Stats
    total_videos: "Total Videos",
    total_views: "Total Views",
    categories_count: "Categories",

    // Video List
    top_videos_title: "Top 10 Videos",
    sort_by: "Sort by:",
    most_popular: "Most Popular",
    most_recent: "Most Recent",
    most_viewed: "Most Viewed",
    load_more: "Load More Videos",

    // Footer
    footer_description: "Discover and enjoy the best spiritual content from around the world. Connect with faith through music, sermons, and educational videos.",
    quick_links: "Quick Links",
    browse_videos: "Browse Videos",
    upload_video: "Upload Video",
    help_center: "Help Center",
    support: "Support",
    contact_us: "Contact Us",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    community_guidelines: "Community Guidelines",
    copyright: "© 2024 MyVideo. All rights reserved. Built with ❤️ for the faith community.",

    // Video metadata
    views: "views",
    ago: "ago",
    days: "days",
    weeks: "weeks",
    months: "months",
  },
  es: {
    // Header
    dashboard: "Panel",
    browse: "Explorar",
    categories: "Categorías",
    favorites: "Favoritos",
    search_placeholder: "Buscar videos...",

    // Dashboard
    dashboard_title: "Panel de Videos Principales",
    dashboard_subtitle: "Descubre los videos más populares en todas las categorías",
    all_categories: "Todas las Categorías",
    music: "Música",
    sermons: "Sermones",
    other: "Otros",

    // Stats
    total_videos: "Videos Totales",
    total_views: "Visualizaciones Totales",
    categories_count: "Categorías",

    // Video List
    top_videos_title: "Top 10 Videos",
    sort_by: "Ordenar por:",
    most_popular: "Más Populares",
    most_recent: "Más Recientes",
    most_viewed: "Más Vistos",
    load_more: "Cargar Más Videos",

    // Footer
    footer_description: "Descubre y disfruta del mejor contenido espiritual de todo el mundo. Conecta con la fe a través de música, sermones y videos educativos.",
    quick_links: "Enlaces Rápidos",
    browse_videos: "Explorar Videos",
    upload_video: "Subir Video",
    help_center: "Centro de Ayuda",
    support: "Soporte",
    contact_us: "Contáctanos",
    privacy_policy: "Política de Privacidad",
    terms_of_service: "Términos de Servicio",
    community_guidelines: "Directrices de la Comunidad",
    copyright: "© 2024 MyVideo. Todos los derechos reservados. Hecho con ❤️ para la comunidad de fe.",

    // Video metadata
    views: "visualizaciones",
    ago: "hace",
    days: "días",
    weeks: "semanas",
    months: "meses",
  },
  ko: {
    // Header
    dashboard: "대시보드",
    browse: "탐색",
    categories: "카테고리",
    favorites: "즐겨찾기",
    search_placeholder: "비디오 검색...",

    // Dashboard
    dashboard_title: "인기 비디오 대시보드",
    dashboard_subtitle: "모든 카테고리에서 가장 인기 있는 비디오를 발견하세요",
    all_categories: "모든 카테고리",
    music: "음악",
    sermons: "설교",
    other: "기타",

    // Stats
    total_videos: "총 비디오",
    total_views: "총 조회수",
    categories_count: "카테고리",

    // Video List
    top_videos_title: "상위 10개 비디오",
    sort_by: "정렬:",
    most_popular: "가장 인기",
    most_recent: "최신",
    most_viewed: "가장 많이 본",
    load_more: "더 많은 비디오 로드",

    // Footer
    footer_description: "전 세계 최고의 영적 콘텐츠를 발견하고 즐기세요. 음악, 설교, 교육 비디오를 통해 믿음과 연결하세요.",
    quick_links: "빠른 링크",
    browse_videos: "비디오 탐색",
    upload_video: "비디오 업로드",
    help_center: "도움말 센터",
    support: "지원",
    contact_us: "문의하기",
    privacy_policy: "개인정보 처리방침",
    terms_of_service: "이용약관",
    community_guidelines: "커뮤니티 가이드라인",
    copyright: "© 2024 MyVideo. 모든 권리 보유. 신앙 공동체를 위해 ❤️로 제작.",

    // Video metadata
    views: "조회수",
    ago: "전",
    days: "일",
    weeks: "주",
    months: "개월",
  },
};

export type Language = keyof Translations;

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key] || key;
};

export const formatViews = (views: number, language: Language): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M ${getTranslation('views', language)}`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K ${getTranslation('views', language)}`;
  }
  return `${views} ${getTranslation('views', language)}`;
};

export const formatTimeAgo = (date: Date, language: Language): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return `${diffDays} ${getTranslation('days', language)} ${getTranslation('ago', language)}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${getTranslation('weeks', language)} ${getTranslation('ago', language)}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${getTranslation('months', language)} ${getTranslation('ago', language)}`;
  }
};
