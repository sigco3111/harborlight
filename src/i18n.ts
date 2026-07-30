export type Locale = "en" | "vi";

export const LANGUAGE_STORAGE_KEY = "harborlight-language";

export interface HarborMessages {
  readonly languageCode: "ENG" | "VIE";
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

const MESSAGES: Readonly<Record<Locale, HarborMessages>> = {
  en: ENGLISH,
  vi: VIETNAMESE,
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "vi";
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
  return navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en";
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
