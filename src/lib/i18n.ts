import type { RouteId } from "./navigation";

export type SupportedLanguage = "en" | "zh-CN" | "es" | "fr" | "de" | "it" | "ja" | "ko" | "pt-BR";

type TranslationKey =
  | `nav.${RouteId}`
  | "nav.primary"
  | "nav.pluginsSection"
  | "brand.subtitle"
  | "button.command"
  | "button.search"
  | "button.refreshStatus"
  | "command.searchPlaceholder"
  | "command.close"
  | "command.goTo"
  | "command.openSection"
  | "command.openTools"
  | "settings.searchTitle"
  | "settings.searchDescription"
  | "settings.searchPlaceholder"
  | "settings.searchButton";

const dictionaries: Record<SupportedLanguage, Partial<Record<TranslationKey, string>>> = {
  en: {
    "nav.home": "Home",
    "nav.downloads": "Downloads",
    "nav.tools": "Tools",
    "nav.channels": "Channels",
    "nav.courses": "Courses",
    "nav.learning": "Learning",
    "nav.telegram": "Telegram",
    "nav.settings": "Settings",
    "nav.plugins": "Plugins",
    "nav.legal": "Legal",
    "nav.about": "About",
    "nav.primary": "Primary navigation",
    "nav.pluginsSection": "Plugins",
    "brand.subtitle": "Local download workspace",
    "button.command": "Command",
    "button.search": "Search",
    "button.refreshStatus": "Refresh status",
    "command.searchPlaceholder": "Search commands",
    "command.close": "Close",
    "command.goTo": "Go to {label}",
    "command.openSection": "Open the {label} section",
    "command.openTools":
      "Open media tools for platform support matrix, metadata, thumbnails, subtitles, chapters, comments, video clip, shot detection, waveform peaks, and subtitle workshop",
    "settings.searchTitle": "Settings search",
    "settings.searchDescription": "Find implemented settings in this build.",
    "settings.searchPlaceholder": "Search settings",
    "settings.searchButton": "Search"
  },
  "zh-CN": {
    "nav.home": "首页",
    "nav.downloads": "下载",
    "nav.tools": "工具",
    "nav.channels": "频道",
    "nav.courses": "课程",
    "nav.learning": "学习",
    "nav.telegram": "Telegram",
    "nav.settings": "设置",
    "nav.plugins": "插件",
    "nav.legal": "法务",
    "nav.about": "关于",
    "nav.primary": "主导航",
    "nav.pluginsSection": "插件",
    "brand.subtitle": "本地下载工作台",
    "button.command": "命令",
    "button.search": "搜索",
    "button.refreshStatus": "刷新状态",
    "command.searchPlaceholder": "搜索命令",
    "command.close": "关闭",
    "command.goTo": "前往{label}",
    "command.openSection": "打开{label}页面",
    "command.openTools": "打开平台支持矩阵、媒体工具、字幕、章节、评论、剪辑、波形和字幕工作台",
    "settings.searchTitle": "设置搜索",
    "settings.searchDescription": "查找当前版本已经接入的设置项。",
    "settings.searchPlaceholder": "搜索设置",
    "settings.searchButton": "搜索"
  },
  es: {
    "nav.home": "Inicio",
    "nav.downloads": "Descargas",
    "nav.tools": "Herramientas",
    "nav.channels": "Canales",
    "nav.courses": "Cursos",
    "nav.learning": "Aprendizaje",
    "nav.telegram": "Telegram",
    "nav.settings": "Ajustes",
    "nav.plugins": "Plugins",
    "nav.legal": "Legal",
    "nav.about": "Acerca de",
    "nav.pluginsSection": "Plugins",
    "nav.primary": "Navegacion principal",
    "brand.subtitle": "Espacio local de descargas",
    "button.command": "Comandos",
    "button.search": "Buscar",
    "button.refreshStatus": "Actualizar estado",
    "command.searchPlaceholder": "Buscar comandos",
    "command.close": "Cerrar",
    "command.goTo": "Ir a {label}",
    "command.openSection": "Abrir la seccion {label}",
    "command.openTools":
      "Abrir herramientas multimedia para matriz de plataformas, metadatos, miniaturas, subtitulos, capitulos, comentarios, recorte de video, deteccion de cortes, forma de onda y taller de subtitulos",
    "settings.searchTitle": "Busqueda de ajustes",
    "settings.searchDescription": "Encuentra ajustes ya conectados en esta version.",
    "settings.searchPlaceholder": "Buscar ajustes",
    "settings.searchButton": "Buscar"
  },
  fr: {
    "nav.home": "Accueil",
    "nav.downloads": "Telechargements",
    "nav.tools": "Outils",
    "nav.channels": "Chaines",
    "nav.courses": "Cours",
    "nav.learning": "Apprentissage",
    "nav.telegram": "Telegram",
    "nav.settings": "Reglages",
    "nav.plugins": "Plugins",
    "nav.legal": "Legal",
    "nav.about": "A propos",
    "nav.pluginsSection": "Plugins",
    "nav.primary": "Navigation principale",
    "brand.subtitle": "Espace local de telechargement",
    "button.command": "Commandes",
    "button.search": "Rechercher",
    "button.refreshStatus": "Actualiser l'etat",
    "command.searchPlaceholder": "Rechercher des commandes",
    "command.close": "Fermer",
    "command.goTo": "Aller a {label}",
    "command.openSection": "Ouvrir la section {label}",
    "command.openTools":
      "Ouvrir les outils media pour matrice de plateformes, metadonnees, miniatures, sous-titres, chapitres, commentaires, decoupe video, detection de plans, forme d'onde et atelier de sous-titres",
    "settings.searchTitle": "Recherche des reglages",
    "settings.searchDescription": "Trouver les reglages deja relies dans cette version.",
    "settings.searchPlaceholder": "Rechercher les reglages",
    "settings.searchButton": "Rechercher"
  },
  de: {
    "nav.home": "Start",
    "nav.downloads": "Downloads",
    "nav.tools": "Werkzeuge",
    "nav.channels": "Kanale",
    "nav.courses": "Kurse",
    "nav.learning": "Lernen",
    "nav.telegram": "Telegram",
    "nav.settings": "Einstellungen",
    "nav.plugins": "Plugins",
    "nav.legal": "Rechtliches",
    "nav.about": "Info",
    "nav.pluginsSection": "Plugins",
    "nav.primary": "Hauptnavigation",
    "brand.subtitle": "Lokaler Download-Arbeitsbereich",
    "button.command": "Befehl",
    "button.search": "Suchen",
    "button.refreshStatus": "Status aktualisieren",
    "command.searchPlaceholder": "Befehle suchen",
    "command.close": "Schliessen",
    "command.goTo": "Zu {label}",
    "command.openSection": "Abschnitt {label} offnen",
    "command.openTools":
      "Medienwerkzeuge fur Plattformmatrix, Metadaten, Thumbnails, Untertitel, Kapitel, Kommentare, Videoschnitt, Szenenerkennung, Wellenform und Untertitelwerkstatt offnen",
    "settings.searchTitle": "Einstellungen suchen",
    "settings.searchDescription": "Bereits verbundene Einstellungen in diesem Build finden.",
    "settings.searchPlaceholder": "Einstellungen suchen",
    "settings.searchButton": "Suchen"
  },
  it: {
    "nav.home": "Home",
    "nav.downloads": "Download",
    "nav.tools": "Strumenti",
    "nav.channels": "Canali",
    "nav.courses": "Corsi",
    "nav.learning": "Studio",
    "nav.telegram": "Telegram",
    "nav.settings": "Impostazioni",
    "nav.plugins": "Plugin",
    "nav.legal": "Legale",
    "nav.about": "Info",
    "nav.pluginsSection": "Plugin",
    "nav.primary": "Navigazione principale",
    "brand.subtitle": "Area download locale",
    "button.command": "Comandi",
    "button.search": "Cerca",
    "button.refreshStatus": "Aggiorna stato",
    "command.searchPlaceholder": "Cerca comandi",
    "command.close": "Chiudi",
    "command.goTo": "Vai a {label}",
    "command.openSection": "Apri la sezione {label}",
    "command.openTools":
      "Apri gli strumenti media per matrice piattaforme, metadati, miniature, sottotitoli, capitoli, commenti, ritaglio video, rilevamento scene, forma d'onda e laboratorio sottotitoli",
    "settings.searchTitle": "Ricerca impostazioni",
    "settings.searchDescription": "Trova le impostazioni gia collegate in questa build.",
    "settings.searchPlaceholder": "Cerca impostazioni",
    "settings.searchButton": "Cerca"
  },
  ja: {
    "nav.home": "ホーム",
    "nav.downloads": "ダウンロード",
    "nav.tools": "ツール",
    "nav.channels": "チャンネル",
    "nav.courses": "コース",
    "nav.learning": "学習",
    "nav.telegram": "Telegram",
    "nav.settings": "設定",
    "nav.plugins": "プラグイン",
    "nav.legal": "法務",
    "nav.about": "情報",
    "nav.pluginsSection": "プラグイン",
    "nav.primary": "メインナビゲーション",
    "brand.subtitle": "ローカルダウンロード作業場",
    "button.command": "コマンド",
    "button.search": "検索",
    "button.refreshStatus": "状態を更新",
    "command.searchPlaceholder": "コマンドを検索",
    "command.close": "閉じる",
    "command.goTo": "{label}へ移動",
    "command.openSection": "{label}セクションを開く",
    "command.openTools":
      "プラットフォーム表、メタデータ、サムネイル、字幕、チャプター、コメント、動画クリップ、ショット検出、波形、字幕ワークショップのメディアツールを開く",
    "settings.searchTitle": "設定検索",
    "settings.searchDescription": "このビルドで接続済みの設定を探します。",
    "settings.searchPlaceholder": "設定を検索",
    "settings.searchButton": "検索"
  },
  ko: {
    "nav.home": "홈",
    "nav.downloads": "다운로드",
    "nav.tools": "도구",
    "nav.channels": "채널",
    "nav.courses": "강의",
    "nav.learning": "학습",
    "nav.telegram": "Telegram",
    "nav.settings": "설정",
    "nav.plugins": "플러그인",
    "nav.legal": "법적 안내",
    "nav.about": "정보",
    "nav.pluginsSection": "플러그인",
    "nav.primary": "기본 탐색",
    "brand.subtitle": "로컬 다운로드 작업 공간",
    "button.command": "명령",
    "button.search": "검색",
    "button.refreshStatus": "상태 새로고침",
    "command.searchPlaceholder": "명령 검색",
    "command.close": "닫기",
    "command.goTo": "{label}(으)로 이동",
    "command.openSection": "{label} 섹션 열기",
    "command.openTools":
      "플랫폼 매트릭스, 메타데이터, 썸네일, 자막, 챕터, 댓글, 비디오 클립, 장면 감지, 파형, 자막 워크숍용 미디어 도구 열기",
    "settings.searchTitle": "설정 검색",
    "settings.searchDescription": "이 빌드에 연결된 설정을 찾습니다.",
    "settings.searchPlaceholder": "설정 검색",
    "settings.searchButton": "검색"
  },
  "pt-BR": {
    "nav.home": "Inicio",
    "nav.downloads": "Downloads",
    "nav.tools": "Ferramentas",
    "nav.channels": "Canais",
    "nav.courses": "Cursos",
    "nav.learning": "Aprendizado",
    "nav.telegram": "Telegram",
    "nav.settings": "Configuracoes",
    "nav.plugins": "Plugins",
    "nav.legal": "Legal",
    "nav.about": "Sobre",
    "nav.pluginsSection": "Plugins",
    "nav.primary": "Navegacao principal",
    "brand.subtitle": "Espaco local de downloads",
    "button.command": "Comandos",
    "button.search": "Pesquisar",
    "button.refreshStatus": "Atualizar status",
    "command.searchPlaceholder": "Pesquisar comandos",
    "command.close": "Fechar",
    "command.goTo": "Ir para {label}",
    "command.openSection": "Abrir a secao {label}",
    "command.openTools":
      "Abrir ferramentas de midia para matriz de plataformas, metadados, miniaturas, legendas, capitulos, comentarios, recorte de video, deteccao de cenas, forma de onda e oficina de legendas",
    "settings.searchTitle": "Pesquisa de configuracoes",
    "settings.searchDescription": "Encontre configuracoes ja conectadas nesta versao.",
    "settings.searchPlaceholder": "Pesquisar configuracoes",
    "settings.searchButton": "Pesquisar"
  }
};

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage {
  const normalized = (value || "en").trim();
  return Object.prototype.hasOwnProperty.call(dictionaries, normalized)
    ? (normalized as SupportedLanguage)
    : "en";
}

export function translate(
  language: string | null | undefined,
  key: TranslationKey,
  values: Record<string, string> = {}
): string {
  const normalized = normalizeLanguage(language);
  const template = dictionaries[normalized][key] ?? dictionaries.en[key] ?? key;
  return Object.entries(values).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, value),
    template
  );
}
