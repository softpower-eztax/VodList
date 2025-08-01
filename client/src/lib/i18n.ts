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
    dashboard_subtitle:
      "Discover the most popular videos across all categories",
    all_categories: "All Categories",
    music: "Music",
    sermons: "Sermons",
    other: "Other",

    // favor
    favor_title: "Favorite Videos",
    favor_subtitle: "Browse your curated collection of favorite videos.",

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
    load_videos: "Load Videos",
    load_more: "Load More Videos",

    // Footer
    footer_description:
      "Discover and enjoy the best spiritual content from around the world. Connect with faith through music, sermons, and educational videos.",
    quick_links: "Quick Links",
    browse_videos: "Browse Videos",
    upload_video: "Upload Video",
    help_center: "Help Center",
    support: "Support",
    contact_us: "Contact Us",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    community_guidelines: "Community Guidelines",
    copyright:
      "© 2024 MyVideo. All rights reserved. Built with ❤️ for the faith community.",

    // Video metadata
    views: "views",
    ago: "ago",
    days: "days",
    weeks: "weeks",
    months: "months",

    // Category management
    manage_categories: "Manage Categories",
    manage_categories_description:
      "Create, edit, and organize video categories",
    create_category: "Create Category",
    edit_category: "Edit Category",
    update_category: "Update Category",
    category_name: "Category Name",
    category_name_placeholder: "Enter category name",
    description: "Description",
    description_placeholder: "Enter category description",
    keywords: "Keywords",
    add_keyword: "Add keyword",
    no_categories: "No Categories Found",
    no_categories_description: "Get started by creating your first category",
    back_to_dashboard: "Back to Dashboard",
    edit: "Edit",
    delete: "Delete",
    deleting: "Deleting...",
    cancel: "Cancel",
    success: "Success",
    error: "Error",
    category_created_success: "Category created successfully",
    category_updated_success: "Category updated successfully",
    category_deleted_success: "Category deleted successfully",
    category_create_error: "Failed to create category",
    category_update_error: "Failed to update category",
    category_delete_error: "Failed to delete category",
    confirm_delete_category: "Are you sure you want to delete this category?",
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
    dashboard_subtitle:
      "Descubre los videos más populares en todas las categorías",
    all_categories: "Todas las Categorías",
    music: "Música",
    sermons: "Sermones",
    other: "Otros",

    // favor
    favor_title: "Panel de Videos Principales",
    favor_subtitle: "Explora tu colección curada de videos favoritos.",

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
    load_videos: "Cargar Videos",
    load_more: "Cargar Más Videos",

    // Footer
    footer_description:
      "Descubre y disfruta del mejor contenido espiritual de todo el mundo. Conecta con la fe a través de música, sermones y videos educativos.",
    quick_links: "Enlaces Rápidos",
    browse_videos: "Explorar Videos",
    upload_video: "Subir Video",
    help_center: "Centro de Ayuda",
    support: "Soporte",
    contact_us: "Contáctanos",
    privacy_policy: "Política de Privacidad",
    terms_of_service: "Términos de Servicio",
    community_guidelines: "Directrices de la Comunidad",
    copyright:
      "© 2024 MyVideo. Todos los derechos reservados. Hecho con ❤️ para la comunidad de fe.",

    // Video metadata
    views: "visualizaciones",
    ago: "hace",
    days: "días",
    weeks: "semanas",
    months: "meses",

    // Category management
    manage_categories: "Gestionar Categorías",
    manage_categories_description:
      "Crear, editar y organizar categorías de videos",
    create_category: "Crear Categoría",
    edit_category: "Editar Categoría",
    update_category: "Actualizar Categoría",
    category_name: "Nombre de Categoría",
    category_name_placeholder: "Ingrese el nombre de la categoría",
    description: "Descripción",
    description_placeholder: "Ingrese la descripción de la categoría",
    keywords: "Palabras Clave",
    add_keyword: "Agregar palabra clave",
    no_categories: "No se Encontraron Categorías",
    no_categories_description: "Comience creando su primera categoría",
    back_to_dashboard: "Volver al Panel",
    edit: "Editar",
    delete: "Eliminar",
    deleting: "Eliminando...",
    cancel: "Cancelar",
    success: "Éxito",
    error: "Error",
    category_created_success: "Categoría creada exitosamente",
    category_updated_success: "Categoría actualizada exitosamente",
    category_deleted_success: "Categoría eliminada exitosamente",
    category_create_error: "Error al crear la categoría",
    category_update_error: "Error al actualizar la categoría",
    category_delete_error: "Error al eliminar la categoría",
    confirm_delete_category:
      "¿Está seguro de que desea eliminar esta categoría?",
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

    // favor
    favor_title: "My 비디오",
    favor_subtitle: "즐겨찾기 비디오 컬렉션을 탐색하세요.",

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
    load_videos: "비디오 로드",
    load_more: "더 많은 비디오 로드",

    // Footer
    footer_description:
      "전 세계 최고의 영적 콘텐츠를 발견하고 즐기세요. 음악, 설교, 교육 비디오를 통해 믿음과 연결하세요.",
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

    // Category management
    manage_categories: "카테고리 관리",
    manage_categories_description: "비디오 카테고리 생성, 편집 및 정리",
    create_category: "카테고리 생성",
    edit_category: "카테고리 편집",
    update_category: "카테고리 업데이트",
    category_name: "카테고리 이름",
    category_name_placeholder: "카테고리 이름을 입력하세요",
    description: "설명",
    description_placeholder: "카테고리 설명을 입력하세요",
    keywords: "키워드",
    add_keyword: "키워드 추가",
    no_categories: "카테고리를 찾을 수 없음",
    no_categories_description: "첫 번째 카테고리를 만들어 시작하세요",
    back_to_dashboard: "대시보드로 돌아가기",
    edit: "편집",
    delete: "삭제",
    deleting: "삭제 중...",
    cancel: "취소",
    success: "성공",
    error: "오류",
    category_created_success: "카테고리가 성공적으로 생성됨",
    category_updated_success: "카테고리가 성공적으로 업데이트됨",
    category_deleted_success: "카테고리가 성공적으로 삭제됨",
    category_create_error: "카테고리 생성 실패",
    category_update_error: "카테고리 업데이트 실패",
    category_delete_error: "카테고리 삭제 실패",
    confirm_delete_category: "이 카테고리를 삭제하시겠습니까?",
  },
};

export type Language = keyof Translations;

export const getTranslation = (key: string, language: Language): string => {
  return translations[language][key] || key;
};

export const formatViews = (views: number, language: Language): string => {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M ${getTranslation("views", language)}`;
  } else if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K ${getTranslation("views", language)}`;
  }
  return `${views} ${getTranslation("views", language)}`;
};

export const formatTimeAgo = (date: Date, language: Language): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} ${getTranslation("days", language)} ${getTranslation("ago", language)}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${getTranslation("weeks", language)} ${getTranslation("ago", language)}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} ${getTranslation("months", language)} ${getTranslation("ago", language)}`;
  }
};
