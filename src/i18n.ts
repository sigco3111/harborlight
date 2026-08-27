export type Locale = "en" | "vi" | "ko";

export const LANGUAGE_STORAGE_KEY = "harborlight-language";

export interface HarborMessages {
  readonly languageCode: "ENG" | "VIE" | "KOR";
  readonly languageName: string;
  readonly switchLanguage: string;
  readonly metaDescription: string;
  readonly canvasLabel: string;
  readonly canvasFallback: string;
  readonly hudLabel: string;
  readonly loading: string;
  readonly fatalTitle: string;
  readonly webglError: string;
  readonly brandTagline: string;
  readonly paletteLabel: string;
  readonly paintLabel: string;
  readonly paintWith: (color: string) => string;
  readonly defaultHint: {
    readonly touch: string;
    readonly desktop: string;
  };
  readonly menu: {
    readonly open: string;
    readonly close: string;
    readonly region: string;
    readonly title: string;
    readonly actionGroup: string;
    readonly undo: string;
    readonly redo: string;
    readonly random: string;
    readonly save: string;
    readonly grid: string;
    readonly gridShow: string;
    readonly gridHide: string;
    readonly sound: string;
    readonly soundOn: string;
    readonly soundOff: string;
    readonly help: string;
    readonly helpShow: string;
    readonly helpHide: string;
    readonly language: string;
    readonly clear: string;
    readonly clearValue: string;
    readonly on: string;
    readonly off: string;
    readonly guideValue: string;
  };
  readonly help: {
    readonly close: string;
    readonly kicker: string;
    readonly title: string;
    readonly touchItems: ReadonlyArray<readonly [string, string]>;
    readonly desktopItems: ReadonlyArray<readonly [string, string]>;
    readonly shortcutsTouch: string;
    readonly shortcutsDesktop: string;
    readonly saveNote: string;
    readonly dismiss: string;
  };
  readonly status: {
    readonly paintSelected: (color: string) => string;
    readonly nothingToRemove: string;
    readonly towerLimit: string;
    readonly buildingRemoved: string;
    readonly foundationPlaced: string;
    readonly storeyAdded: string;
    readonly undone: string;
    readonly restored: string;
    readonly townCleared: string;
    readonly randomTown: string;
    readonly postcardReady: string;
    readonly soundOn: string;
    readonly soundOff: string;
    readonly gridOn: string;
    readonly gridOff: string;
    readonly sharedHarborLoaded: string;
    readonly savedHarborRestored: string;
    readonly languageChanged: string;
  };
  readonly colors: readonly string[];
}

const ENGLISH: HarborMessages = {
  languageCode: "ENG",
  languageName: "English",
  switchLanguage: "Switch to Vietnamese",
  metaDescription: "Harborlight — a tiny town-building toy.",
  canvasLabel: "Build and explore an interactive miniature harbor",
  canvasFallback: "Harborlight requires a browser with canvas support.",
  hudLabel: "Harborlight controls",
  loading: "Shaping the shoreline…",
  fatalTitle: "The harbor could not open.",
  webglError: "WebGL could not start.",
  brandTagline: "Shape the shoreline",
  paletteLabel: "Paint colors",
  paintLabel: "Paint",
  paintWith: (color) => `Paint with ${color}`,
  defaultHint: {
    touch: "Tap to build · Hold to remove · Drag to orbit · Pinch to zoom",
    desktop: "Click to build · Right-click to remove · Drag to orbit · Scroll to zoom",
  },
  menu: {
    open: "Open settings",
    close: "Close settings",
    region: "Town settings",
    title: "Harbor tools",
    actionGroup: "History and town actions",
    undo: "Undo",
    redo: "Redo",
    random: "Random",
    save: "Save",
    grid: "Building grid",
    gridShow: "Show building grid",
    gridHide: "Hide building grid",
    sound: "Sound",
    soundOn: "Turn sound on",
    soundOff: "Turn sound off",
    help: "How to play",
    helpShow: "Show help",
    helpHide: "Hide help",
    language: "Language",
    clear: "Clear town",
    clearValue: "Reset",
    on: "On",
    off: "Off",
    guideValue: "Guide",
  },
  help: {
    close: "Dismiss help",
    kicker: "Harborlight",
    title: "Shape the shoreline",
    touchItems: [
      ["Build", "Tap water, foundations, rooftops, or building sides."],
      ["Remove", "Press and hold an occupied cell."],
      ["Look around", "Drag with one finger."],
      ["Move closer", "Pinch with two fingers."],
    ],
    desktopItems: [
      ["Build", "Click water, foundations, rooftops, or building sides."],
      ["Remove", "Right-click an occupied cell."],
      ["Look around", "Drag the town."],
      ["Move closer", "Scroll to zoom."],
    ],
    shortcutsTouch: "Choose paint at the shore; use the settings dial for history, grid, and sound.",
    shortcutsDesktop: "Shortcuts: 1–9 choose color · Ctrl/⌘ Z undo · Shift Ctrl/⌘ Z redo",
    saveNote: "Your town saves automatically on this device.",
    dismiss: "Start building",
  },
  status: {
    paintSelected: (color) => `${color} paint selected`,
    nothingToRemove: "Nothing here to remove",
    towerLimit: "That tower has reached its limit",
    buildingRemoved: "Building removed",
    foundationPlaced: "New foundation placed",
    storeyAdded: "Storey added",
    undone: "Last change undone",
    restored: "Change restored",
    townCleared: "The town is clear",
    randomTown: "A new harbor appeared",
    postcardReady: "Postcard prepared",
    soundOn: "Sound on",
    soundOff: "Sound off",
    gridOn: "Building grid on",
    gridOff: "Building grid off",
    sharedHarborLoaded: "Shared harbor loaded",
    savedHarborRestored: "Saved harbor restored on this device",
    languageChanged: "Language: English",
  },
  colors: [
    "Poppy",
    "Tangerine",
    "Butter",
    "Citron",
    "Sage",
    "Jade",
    "Lagoon",
    "Sky",
    "Periwinkle",
    "Heather",
    "Rose",
    "Clay",
    "Shell",
    "Limestone",
    "Chalk",
    "Harbor Blue",
  ],
};

const VIETNAMESE: HarborMessages = {
  languageCode: "VIE",
  languageName: "Tiếng Việt",
  switchLanguage: "Chuyển sang tiếng Anh",
  metaDescription: "Harborlight — trò chơi xây thị trấn ven biển thu nhỏ.",
  canvasLabel: "Xây dựng và khám phá một bến cảng thu nhỏ tương tác",
  canvasFallback: "Harborlight cần trình duyệt hỗ trợ canvas.",
  hudLabel: "Bảng điều khiển Harborlight",
  loading: "Đang tạo dựng bờ biển…",
  fatalTitle: "Không thể mở bến cảng.",
  webglError: "Không thể khởi động WebGL.",
  brandTagline: "Kiến tạo đường bờ biển",
  paletteLabel: "Màu sơn",
  paintLabel: "Sơn",
  paintWith: (color) => `Sơn bằng màu ${color}`,
  defaultHint: {
    touch: "Chạm để xây · Giữ để xóa · Kéo để xoay · Chụm để thu phóng",
    desktop: "Nhấp để xây · Chuột phải để xóa · Kéo để xoay · Cuộn để thu phóng",
  },
  menu: {
    open: "Mở cài đặt",
    close: "Đóng cài đặt",
    region: "Cài đặt thị trấn",
    title: "Công cụ bến cảng",
    actionGroup: "Lịch sử và thao tác thị trấn",
    undo: "Hoàn tác",
    redo: "Làm lại",
    random: "Ngẫu nhiên",
    save: "Lưu",
    grid: "Lưới xây dựng",
    gridShow: "Hiện lưới xây dựng",
    gridHide: "Ẩn lưới xây dựng",
    sound: "Âm thanh",
    soundOn: "Bật âm thanh",
    soundOff: "Tắt âm thanh",
    help: "Cách chơi",
    helpShow: "Hiện hướng dẫn",
    helpHide: "Ẩn hướng dẫn",
    language: "Ngôn ngữ",
    clear: "Xóa thị trấn",
    clearValue: "Đặt lại",
    on: "Bật",
    off: "Tắt",
    guideValue: "Hướng dẫn",
  },
  help: {
    close: "Đóng hướng dẫn",
    kicker: "Harborlight",
    title: "Kiến tạo đường bờ biển",
    touchItems: [
      ["Xây", "Chạm vào mặt nước, móng nhà, mái nhà hoặc mặt bên tòa nhà."],
      ["Xóa", "Nhấn giữ một ô đã xây."],
      ["Quan sát", "Kéo bằng một ngón tay."],
      ["Thu phóng", "Chụm hoặc mở hai ngón tay."],
    ],
    desktopItems: [
      ["Xây", "Nhấp vào mặt nước, móng nhà, mái nhà hoặc mặt bên tòa nhà."],
      ["Xóa", "Nhấp chuột phải vào một ô đã xây."],
      ["Quan sát", "Kéo để xoay thị trấn."],
      ["Thu phóng", "Cuộn để thu phóng."],
    ],
    shortcutsTouch: "Chọn màu sơn bên trái; dùng nút cài đặt để xem lịch sử, lưới và âm thanh.",
    shortcutsDesktop: "Phím tắt: 1–9 chọn màu · Ctrl/⌘ Z hoàn tác · Shift Ctrl/⌘ Z làm lại",
    saveNote: "Thị trấn được tự động lưu trên thiết bị này.",
    dismiss: "Bắt đầu xây dựng",
  },
  status: {
    paintSelected: (color) => `Đã chọn màu ${color}`,
    nothingToRemove: "Không có gì ở đây để xóa",
    towerLimit: "Tháp này đã đạt chiều cao tối đa",
    buildingRemoved: "Đã xóa công trình",
    foundationPlaced: "Đã đặt móng mới",
    storeyAdded: "Đã thêm một tầng",
    undone: "Đã hoàn tác thay đổi gần nhất",
    restored: "Đã khôi phục thay đổi",
    townCleared: "Đã xóa thị trấn",
    randomTown: "Một bến cảng mới đã xuất hiện",
    postcardReady: "Ảnh bưu thiếp đã sẵn sàng",
    soundOn: "Đã bật âm thanh",
    soundOff: "Đã tắt âm thanh",
    gridOn: "Đã bật lưới xây dựng",
    gridOff: "Đã tắt lưới xây dựng",
    sharedHarborLoaded: "Đã tải bến cảng được chia sẻ",
    savedHarborRestored: "Đã khôi phục thị trấn đã lưu trên thiết bị này",
    languageChanged: "Ngôn ngữ: Tiếng Việt",
  },
  colors: [
    "Đỏ anh túc",
    "Cam quýt",
    "Vàng bơ",
    "Vàng chanh",
    "Xanh xô thơm",
    "Xanh ngọc",
    "Xanh đầm phá",
    "Xanh da trời",
    "Xanh dừa cạn",
    "Tím thạch nam",
    "Hồng hoa",
    "Đỏ đất",
    "Hồng vỏ sò",
    "Đá vôi",
    "Trắng phấn",
    "Xanh hải cảng",
  ],
};

const KOREAN: HarborMessages = {
  languageCode: "KOR",
  languageName: "한국어",
  switchLanguage: "한국어로 전환",
  metaDescription: "Harborlight — 미니어처 항구 마을을 짓는 작은 토이 게임입니다.",
  canvasLabel: "상호작용하는 미니어처 항구를 짓고 둘러보기",
  canvasFallback: "Harborlight는 캔버스를 지원하는 브라우저가 필요합니다.",
  hudLabel: "Harborlight 조작 패널",
  loading: "해안선을 만드는 중…",
  fatalTitle: "항구를 열 수 없습니다.",
  webglError: "WebGL을 시작할 수 없습니다.",
  brandTagline: "해안선을 빚어보세요",
  paletteLabel: "페인트 색상",
  paintLabel: "페인트",
  paintWith: (color) => `${color}로 칠하기`,
  defaultHint: {
    touch: "탭하여 짓기 · 길게 눌러 지우기 · 드래그하여 회전 · 핀치하여 줌인",
    desktop: "클릭하여 짓기 · 우클릭하여 지우기 · 드래그하여 회전 · 스크롤하여 줌인",
  },
  menu: {
    open: "설정 열기",
    close: "설정 닫기",
    region: "마을 설정",
    title: "항구 도구",
    actionGroup: "기록 및 마을 동작",
    undo: "실행 취소",
    redo: "다시 실행",
    random: "무작위",
    save: "저장",
    grid: "건물 격자",
    gridShow: "건물 격자 표시",
    gridHide: "건물 격자 숨기기",
    sound: "소리",
    soundOn: "소리 켜기",
    soundOff: "소리 끄기",
    help: "플레이 방법",
    helpShow: "도움말 열기",
    helpHide: "도움말 닫기",
    language: "언어",
    clear: "마을 비우기",
    clearValue: "초기화",
    on: "켜짐",
    off: "꺼짐",
    guideValue: "안내",
  },
  help: {
    close: "도움말 닫기",
    kicker: "Harborlight",
    title: "해안선을 빚어보세요",
    touchItems: [
      ["짓기", "물 위, 기초, 옥상, 건물의 옆면을 탭하세요."],
      ["지우기", "이미 지어진 칸을 길게 누르세요."],
      ["둘러보기", "한 손가락으로 드래그하세요."],
      ["가까이", "두 손가락으로 핀치하세요."],
    ],
    desktopItems: [
      ["짓기", "물 위, 기초, 옥상, 건물의 옆면을 클릭하세요."],
      ["지우기", "지어진 칸을 우클릭하세요."],
      ["둘러보기", "마을을 드래그해 회전하세요."],
      ["가까이", "스크롤하여 줌인·줌아웃하세요."],
    ],
    shortcutsTouch: "왼쪽에서 색을 고르고, 설정 다이얼에서 기록·격자·소리를 조절하세요.",
    shortcutsDesktop: "단축키: 1–9 색 선택 · Ctrl/⌘ Z 실행 취소 · Shift Ctrl/⌘ Z 다시 실행",
    saveNote: "마을은 이 기기에 자동으로 저장됩니다.",
    dismiss: "건설 시작",
  },
  status: {
    paintSelected: (color) => `${color} 색 선택됨`,
    nothingToRemove: "여기엔 지울 것이 없습니다",
    towerLimit: "이 탑은 최대 높이에 도달했습니다",
    buildingRemoved: "건물을 지웠습니다",
    foundationPlaced: "새 기초를 놓았습니다",
    storeyAdded: "층을 추가했습니다",
    undone: "마지막 변경을 되돌렸습니다",
    restored: "변경을 복원했습니다",
    townCleared: "마을이 비어 있습니다",
    randomTown: "새 항구가 등장했습니다",
    postcardReady: "엽서 준비 완료",
    soundOn: "소리 켜짐",
    soundOff: "소리 꺼짐",
    gridOn: "건물 격자 켜짐",
    gridOff: "건물 격자 꺼짐",
    sharedHarborLoaded: "공유된 항구를 불러왔습니다",
    savedHarborRestored: "이 기기에 저장된 항구를 복원했습니다",
    languageChanged: "언어: 한국어",
  },
  colors: [
    "양귀비",
    "귤",
    "버터",
    "레몬그라스",
    "세이지",
    "비취",
    "라군",
    "하늘",
    "페리윙클",
    "히스",
    "로즈",
    "테라코타",
    "셸",
    "라임스톤",
    "초크",
    "항구 블루",
  ],
};

const MESSAGES: Readonly<Record<Locale, HarborMessages>> = {
  en: ENGLISH,
  vi: VIETNAMESE,
  ko: KOREAN,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "vi" || value === "ko";
}

export function getMessages(locale: Locale): HarborMessages {
  return MESSAGES[locale];
}

export function getInitialLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // Continue with the browser language when storage is unavailable.
  }
  const navigatorLanguage = typeof navigator !== "undefined" ? navigator.language.toLowerCase() : "";
  if (navigatorLanguage.startsWith("ko")) return "ko";
  return navigatorLanguage.startsWith("vi") ? "vi" : "en";
}

export function storeLocale(locale: Locale): void {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // The language still applies for this session when storage is unavailable.
  }
}

export function applyDocumentLocale(locale: Locale): void {
  const messages = getMessages(locale);
  document.documentElement.lang = locale;
  document.querySelector('meta[name="description"]')?.setAttribute("content", messages.metaDescription);
  document.querySelector<HTMLCanvasElement>("#world")?.setAttribute("aria-label", messages.canvasLabel);
  document.querySelector<HTMLElement>("#hud")?.setAttribute("aria-label", messages.hudLabel);
  const canvas = document.querySelector<HTMLCanvasElement>("#world");
  if (canvas) canvas.textContent = messages.canvasFallback;
  const loading = document.querySelector<HTMLElement>("#loading");
  const loadingCopy = loading?.querySelector<HTMLElement>("[data-loading-copy]");
  if (loadingCopy) loadingCopy.textContent = messages.loading;
}
