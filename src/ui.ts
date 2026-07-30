import { PALETTE } from "./config";
import { applyDocumentLocale, getInitialLocale, getMessages, storeLocale, type HarborMessages, type Locale } from "./i18n";
import type { HudCallbacks, HudController } from "./types";

type IconName =
  | "add"
  | "clear"
  | "close"
  | "grid"
  | "language"
  | "help"
  | "orbit"
  | "random"
  | "redo"
  | "remove"
  | "save"
  | "settings"
  | "sound"
  | "undo"
  | "zoom";

export type HarborHudCallbacks = HudCallbacks & {
  /** Optional until the renderer grid hook is integrated; existing callers remain valid. */
  onToggleGrid?(enabled: boolean): void;
  onLanguageChange?(locale: Locale): void;
};

export type HarborHudController = HudController & {
  setGrid(enabled: boolean): void;
};

const HELP_STORAGE_KEY = "harborlight.help.dismissed.v1";
const GRID_STORAGE_KEY = "harborlight-grid";
const SOUND_STORAGE_KEY = "harborlight-sound";
const EXTRA_PALETTE_COLOR: (typeof PALETTE)[number] = {
  name: "Harbor Blue",
  wall: 0x367f98,
  wallShadow: 0x285f79,
  trim: 0xd9e9db,
  roof: 0x485f76,
};
const HUD_PALETTE: readonly (typeof PALETTE)[number][] =
  PALETTE.length >= 15 ? PALETTE.slice(0, 15) : [...PALETTE, EXTRA_PALETTE_COLOR];
let hudInstance = 0;

const ICONS: Record<IconName, string> = {
  add: '<path d="M12 5v14M5 12h14"/>',
  clear:
    '<path d="M5 7h14M9 7V4.5h6V7m2 0-.7 12H7.7L7 7m3 3v6m4-6v6"/>',
  close: '<path d="m7 7 10 10M17 7 7 17"/>',
  grid:
    '<path d="M5 5h14v14H5zM9.7 5v14M14.3 5v14M5 9.7h14M5 14.3h14"/>',
  language:
    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.1 2.3 3.2 5.1 3.2 8.5s-1.1 6.2-3.2 8.5c-2.1-2.3-3.2-5.1-3.2-8.5S9.9 5.8 12 3.5z"/>',
  help:
    '<path d="M9.4 9a2.7 2.7 0 1 1 4.1 2.3c-1 .6-1.5 1.2-1.5 2.2"/><path d="M12 17.5h.01"/>',
  orbit:
    '<path d="M5.5 9A7 7 0 0 1 18 7.5M18.5 15A7 7 0 0 1 6 16.5"/><path d="m17 4.5 1 3.2-3.2.8M7 19.5l-1-3.2 3.2-.8"/>',
  random:
    '<rect x="4.5" y="4.5" width="15" height="15" rx="3"/><circle cx="9" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r=".8" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none"/><circle cx="9" cy="15" r=".8" fill="currentColor" stroke="none"/><circle cx="15" cy="15" r=".8" fill="currentColor" stroke="none"/>',
  redo: '<path d="M18 8H9.5a5.5 5.5 0 0 0-5.2 7.3"/><path d="m15 5 3 3-3 3"/>',
  remove: '<path d="M5 12h14"/>',
  save:
    '<path d="M5 4.5h12.2L19.5 7v12.5h-15z"/><path d="M8 4.5v5h8v-5M8 19.5v-6h8v6"/>',
  settings:
    '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  sound:
    '<path d="M5 10v4h3l4 3V7l-4 3zM15 9.2a4 4 0 0 1 0 5.6M17.5 6.8a7.5 7.5 0 0 1 0 10.4"/>',
  undo: '<path d="M6 8h8.5a5.5 5.5 0 0 1 5.2 7.3"/><path d="m9 5-3 3 3 3"/>',
  zoom:
    '<circle cx="10.5" cy="10.5" r="5.5"/><path d="m14.5 14.5 5 5M10.5 7.8v5.4M7.8 10.5h5.4"/>',
};

function icon(name: IconName): string {
  return `<svg class="hud-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

function toCssColor(value: number): string {
  return `#${value.toString(16).padStart(6, "0")}`;
}

function readToggle(key: string, fallback: boolean): boolean {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value !== "off" && value !== "false";
  } catch {
    return fallback;
  }
}

function writeToggle(key: string, enabled: boolean): void {
  try {
    window.localStorage.setItem(key, enabled ? "on" : "off");
  } catch {
    // The control still works for this session when storage is unavailable.
  }
}

function makeButton(
  className: string,
  label: string,
  iconName: IconName,
  visibleLabel?: string,
): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.setAttribute("aria-label", label);
  button.innerHTML = `${icon(iconName)}${
    visibleLabel ? `<span class="action-label" aria-hidden="true">${visibleLabel}</span>` : ""
  }`;
  return button;
}

function wasHelpDismissed(): boolean {
  try {
    return window.localStorage.getItem(HELP_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberHelpDismissal(): void {
  try {
    window.localStorage.setItem(HELP_STORAGE_KEY, "true");
  } catch {
    // The help still dismisses for this session when storage is unavailable.
  }
}

export function createHud(root: HTMLElement, callbacks: HarborHudCallbacks): HarborHudController {
  const listeners = new AbortController();
  const { signal } = listeners;
  const instanceId = ++hudInstance;
  const helpTitleId = `harbor-help-title-${instanceId}`;
  const helpCardId = `harbor-help-${instanceId}`;
  const menuPanelId = `harbor-menu-${instanceId}`;
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  let locale: Locale = getInitialLocale();
  let copy: HarborMessages = getMessages(locale);
  applyDocumentLocale(locale);
  const getDefaultHint = (): string => (isTouch ? copy.defaultHint.touch : copy.defaultHint.desktop);
  let selectedColor = 0;
  let soundEnabled = readToggle(SOUND_STORAGE_KEY, true);
  let gridEnabled = readToggle(GRID_STORAGE_KEY, false);
  let disposed = false;
  let loadingTimer = 0;
  let focusFrame = 0;
  let statusTimer = 0;
  let hintTimer = 0;

  root.replaceChildren();
  root.classList.add("hud-root");

  const paletteWrap = document.createElement("div");
  paletteWrap.className = "palette-wrap";

  const palette = document.createElement("div");
  palette.className = "palette-rail";
  palette.setAttribute("role", "toolbar");
  palette.setAttribute("aria-label", copy.paletteLabel);
  palette.setAttribute("aria-orientation", "vertical");

  const paletteName = document.createElement("div");
  paletteName.className = "palette-name";
  paletteName.setAttribute("aria-hidden", "true");

  const colorButtons = HUD_PALETTE.map((color, index) => {
    const button = document.createElement("button");
    const chip = document.createElement("span");
    button.type = "button";
    button.className = "color-button";
    button.dataset.colorIndex = String(index);
    button.title = copy.colors[index] ?? color.name;
    button.tabIndex = index === selectedColor ? 0 : -1;
    button.setAttribute("aria-label", copy.paintWith(copy.colors[index] ?? color.name));
    button.setAttribute("aria-pressed", String(index === selectedColor));
    button.style.setProperty("--paint", toCssColor(color.wall));
    chip.className = "color-chip";
    chip.setAttribute("aria-hidden", "true");
    button.append(chip);
    palette.append(button);
    return button;
  });

  paletteName.textContent = copy.colors[selectedColor] ?? copy.paintLabel;
  paletteWrap.append(palette, paletteName);
  const updatePaletteOverflow = (): void => {
    const horizontal = palette.scrollWidth > palette.clientWidth + 1;
    const maximumScroll = horizontal
      ? palette.scrollWidth - palette.clientWidth
      : palette.scrollHeight - palette.clientHeight;
    const currentScroll = horizontal ? palette.scrollLeft : palette.scrollTop;
    paletteWrap.classList.toggle("has-more-above", currentScroll > 1);
    paletteWrap.classList.toggle("has-more-below", maximumScroll > 1 && currentScroll < maximumScroll - 1);
  };
  palette.addEventListener("scroll", updatePaletteOverflow, { passive: true, signal });
  window.addEventListener("resize", updatePaletteOverflow, { signal });
  requestAnimationFrame(() => requestAnimationFrame(updatePaletteOverflow));
  const paletteResizeObserver = new ResizeObserver(updatePaletteOverflow);
  paletteResizeObserver.observe(palette);

  const menu = document.createElement("div");
  menu.className = "hud-menu";

  const menuButton = makeButton("menu-toggle", copy.menu.open, "settings");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-controls", menuPanelId);

  const menuPanel = document.createElement("div");
  menuPanel.id = menuPanelId;
  menuPanel.className = "menu-panel";
  menuPanel.setAttribute("role", "region");
  menuPanel.setAttribute("aria-label", copy.menu.region);
  menuPanel.hidden = true;

  const menuTitle = document.createElement("p");
  const menuBrand = document.createElement("div");
  menuBrand.className = "menu-brand";
  menuBrand.innerHTML = `<span class="menu-brand-mark" aria-hidden="true">H</span><span class="menu-brand-copy"><strong>Harborlight</strong><small>${copy.brandTagline}</small></span>`;
  menuTitle.className = "menu-title";
  menuTitle.textContent = copy.menu.title;

  const quickActions = document.createElement("div");
  quickActions.className = "menu-actions";
  quickActions.setAttribute("role", "group");
  quickActions.setAttribute("aria-label", copy.menu.actionGroup);

  const undoButton = makeButton("tool-button", copy.menu.undo, "undo", copy.menu.undo);
  const redoButton = makeButton("tool-button", copy.menu.redo, "redo", copy.menu.redo);
  const randomButton = makeButton("tool-button", copy.menu.random, "random", copy.menu.random);
  const saveButton = makeButton("tool-button", copy.menu.save, "save", copy.menu.save);
  undoButton.disabled = true;
  redoButton.disabled = true;
  quickActions.append(undoButton, redoButton, randomButton, saveButton);

  const gridButton = makeButton("menu-item", copy.menu.gridShow, "grid");
  gridButton.setAttribute("aria-pressed", String(gridEnabled));
  gridButton.innerHTML += `<span class="menu-label">${copy.menu.grid}</span><span class="menu-value">${gridEnabled ? copy.menu.on : copy.menu.off}</span>`;

  const soundButton = makeButton("menu-item", soundEnabled ? copy.menu.soundOff : copy.menu.soundOn, "sound");
  soundButton.setAttribute("aria-pressed", String(soundEnabled));
  soundButton.innerHTML += `<span class="menu-label">${copy.menu.sound}</span><span class="menu-value">${soundEnabled ? copy.menu.on : copy.menu.off}</span>`;

  const languageButton = makeButton("menu-item", copy.switchLanguage, "language");
  languageButton.innerHTML += `<span class="menu-label">${copy.menu.language}</span><span class="menu-value">${copy.languageCode}</span>`;

  const helpButton = makeButton("menu-item", copy.menu.helpShow, "help");
  helpButton.setAttribute("aria-controls", helpCardId);
  helpButton.setAttribute("aria-expanded", "false");
  helpButton.innerHTML += `<span class="menu-label">${copy.menu.help}</span><span class="menu-value">${copy.menu.guideValue}</span>`;

  const clearButton = makeButton("menu-item menu-item-danger", copy.menu.clear, "clear");
  clearButton.innerHTML += `<span class="menu-label">${copy.menu.clear}</span><span class="menu-value">${copy.menu.clearValue}</span>`;

  menuPanel.append(menuBrand, menuTitle, quickActions, gridButton, soundButton, languageButton, helpButton, clearButton);
  menu.append(menuButton, menuPanel);


  const status = document.createElement("div");
  status.className = "hud-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  status.hidden = true;

  const hint = document.createElement("div");
  hint.className = "hud-hint";
  hint.setAttribute("aria-live", "polite");
  hint.setAttribute("aria-atomic", "true");
  hint.textContent = getDefaultHint();

  const helpCard = document.createElement("section");
  helpCard.id = helpCardId;
  helpCard.className = "help-card";
  helpCard.setAttribute("role", "dialog");
  helpCard.setAttribute("aria-modal", "false");
  helpCard.setAttribute("aria-labelledby", helpTitleId);
  helpCard.hidden = true;

  const helpClose = makeButton("help-close", copy.help.close, "close");
  const helpHeading = document.createElement("div");
  helpHeading.className = "help-heading";
  helpHeading.innerHTML = `<p class="help-kicker">${copy.help.kicker}</p><h1 id="${helpTitleId}">${copy.help.title}</h1>`;

  const helpList = document.createElement("ul");
  helpList.className = "help-list";
  const helpRows: Array<{ title: HTMLElement; description: HTMLElement }> = [];
  for (const gestureIcon of ["add", "remove", "orbit", "zoom"] as const) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    const title = document.createElement("strong");
    const description = document.createElement("span");
    text.append(title, description);
    item.innerHTML = `<span class="help-gesture">${icon(gestureIcon)}</span>`;
    item.append(text);
    helpRows.push({ title, description });
    helpList.append(item);
  }

  const helpShortcuts = document.createElement("p");
  helpShortcuts.className = "help-shortcuts";

  const helpSaveNote = document.createElement("p");
  helpSaveNote.className = "help-save-note";
  helpSaveNote.innerHTML = `${icon("save")}<span>${copy.help.saveNote}</span>`;

  const helpDismiss = document.createElement("button");
  helpDismiss.type = "button";
  helpDismiss.className = "help-dismiss";
  helpDismiss.textContent = copy.help.dismiss;
  helpCard.append(helpClose, helpHeading, helpList, helpShortcuts, helpSaveNote, helpDismiss);

  root.append(paletteWrap, menu, status, hint, helpCard);

  const focusSoon = (element: HTMLElement): void => {
    window.cancelAnimationFrame(focusFrame);
    focusFrame = window.requestAnimationFrame(() => element.focus({ preventScroll: true }));
  };

  const announceStatus = (message: string): void => {
    window.clearTimeout(statusTimer);
    status.textContent = message;
    status.hidden = message.length === 0;
    if (message.length > 0) {
      statusTimer = window.setTimeout(() => {
        status.hidden = true;
      }, 2200);
    }
  };
  const scheduleHintHide = (delay: number): void => {
    window.clearTimeout(hintTimer);
    hintTimer = window.setTimeout(() => {
      hint.hidden = true;
      hintTimer = 0;
    }, delay);
  };

  const setMenuOpen = (open: boolean, focusFirst = false): void => {
    menu.classList.toggle("is-open", open);
    menuPanel.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? copy.menu.close : copy.menu.open);
    if (open && focusFirst) {
      const firstAvailable = menuPanel.querySelector<HTMLButtonElement>("button:not(:disabled)");
      if (firstAvailable) focusSoon(firstAvailable);
    }
  };

  const setHelpOpen = (open: boolean, notify: boolean, focusDismiss = false): void => {
    helpCard.hidden = !open;
    helpButton.setAttribute("aria-expanded", String(open));
    helpButton.setAttribute("aria-label", open ? copy.menu.helpHide : copy.menu.helpShow);
    if (notify) callbacks.onToggleHelp();
    if (open && focusDismiss) focusSoon(helpClose);
  };

  const setActionCopy = (button: HTMLButtonElement, label: string, visibleLabel = label): void => {
    button.setAttribute("aria-label", label);
    const visible = button.querySelector<HTMLElement>(".action-label");
    if (visible) visible.textContent = visibleLabel;
  };


  const renderLocale = (nextLocale: Locale): void => {
    locale = nextLocale;
    copy = getMessages(locale);
    applyDocumentLocale(locale);
    palette.setAttribute("aria-label", copy.paletteLabel);
    colorButtons.forEach((button, index) => {
      const colorName = copy.colors[index] ?? HUD_PALETTE[index]?.name ?? copy.paintLabel;
      button.title = colorName;
      button.setAttribute("aria-label", copy.paintWith(colorName));
    });
    paletteName.textContent = copy.colors[selectedColor] ?? copy.paintLabel;
    menuButton.setAttribute("aria-label", menuPanel.hidden ? copy.menu.open : copy.menu.close);
    menuPanel.setAttribute("aria-label", copy.menu.region);
    menuTitle.textContent = copy.menu.title;
    quickActions.setAttribute("aria-label", copy.menu.actionGroup);
    setActionCopy(undoButton, copy.menu.undo);
    setActionCopy(redoButton, copy.menu.redo);
    setActionCopy(randomButton, copy.menu.random);
    setActionCopy(saveButton, copy.menu.save);
    gridButton.setAttribute("aria-label", gridEnabled ? copy.menu.gridHide : copy.menu.gridShow);
    gridButton.querySelector<HTMLElement>(".menu-label")!.textContent = copy.menu.grid;
    gridButton.querySelector<HTMLElement>(".menu-value")!.textContent = gridEnabled ? copy.menu.on : copy.menu.off;
    soundButton.setAttribute("aria-label", soundEnabled ? copy.menu.soundOff : copy.menu.soundOn);
    soundButton.querySelector<HTMLElement>(".menu-label")!.textContent = copy.menu.sound;
    soundButton.querySelector<HTMLElement>(".menu-value")!.textContent = soundEnabled ? copy.menu.on : copy.menu.off;
    languageButton.setAttribute("aria-label", copy.switchLanguage);
    languageButton.querySelector<HTMLElement>(".menu-label")!.textContent = copy.menu.language;
    languageButton.querySelector<HTMLElement>(".menu-value")!.textContent = copy.languageCode;
    helpButton.setAttribute("aria-label", helpCard.hidden ? copy.menu.helpShow : copy.menu.helpHide);
    helpButton.querySelector<HTMLElement>(".menu-label")!.textContent = copy.menu.help;
    helpButton.querySelector<HTMLElement>(".menu-value")!.textContent = copy.menu.guideValue;
    clearButton.setAttribute("aria-label", copy.menu.clear);
    clearButton.querySelector<HTMLElement>(".menu-label")!.textContent = copy.menu.clear;
    clearButton.querySelector<HTMLElement>(".menu-value")!.textContent = copy.menu.clearValue;
    menuBrand.querySelector<HTMLElement>(".menu-brand-copy small")!.textContent = copy.brandTagline;
    helpClose.setAttribute("aria-label", copy.help.close);
    helpHeading.innerHTML = `<p class="help-kicker">${copy.help.kicker}</p><h1 id="${helpTitleId}">${copy.help.title}</h1>`;
    const helpItems = isTouch ? copy.help.touchItems : copy.help.desktopItems;
    helpItems.forEach(([title, description], index) => {
      const row = helpRows[index];
      if (row) {
        row.title.textContent = title;
        row.description.textContent = description;
      }
    });
    helpShortcuts.textContent = isTouch ? copy.help.shortcutsTouch : copy.help.shortcutsDesktop;
    helpSaveNote.innerHTML = `${icon("save")}<span>${copy.help.saveNote}</span>`;
    helpDismiss.textContent = copy.help.dismiss;
    hint.textContent = getDefaultHint();
  };
  renderLocale(locale);

  const updateSelectedColor = (index: number, announce: boolean): void => {
    if (!Number.isInteger(index) || index < 0 || index >= colorButtons.length) return;
    selectedColor = index;
    colorButtons.forEach((button, buttonIndex) => {
      const selected = buttonIndex === selectedColor;
      button.tabIndex = selected ? 0 : -1;
      button.setAttribute("aria-pressed", String(selected));
    });
    paletteName.textContent = copy.colors[selectedColor] ?? copy.paintLabel;
    colorButtons[selectedColor]?.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (announce) callbacks.onColor(selectedColor);
  };

  const colorButtonFromEvent = (event: Event): HTMLButtonElement | null => {
    if (!(event.target instanceof Element)) return null;
    const button = event.target.closest<HTMLButtonElement>(".color-button");
    return button && palette.contains(button) ? button : null;
  };

  const updateToggleButton = (button: HTMLButtonElement, enabled: boolean, onLabel: string, offLabel: string): void => {
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? onLabel : offLabel);
    const value = button.querySelector<HTMLElement>(".menu-value");
    if (value) value.textContent = enabled ? copy.menu.on : copy.menu.off;
  };

  palette.addEventListener(
    "click",
    (event) => {
      const button = colorButtonFromEvent(event);
      if (button) updateSelectedColor(Number(button.dataset.colorIndex), true);
    },
    { signal },
  );

  palette.addEventListener(
    "focusin",
    (event) => {
      const button = colorButtonFromEvent(event);
      const index = button ? Number(button.dataset.colorIndex) : selectedColor;
      paletteName.textContent = copy.colors[index] ?? copy.paintLabel;
    },
    { signal },
  );

  palette.addEventListener(
    "pointerover",
    (event) => {
      const button = colorButtonFromEvent(event);
      const index = button ? Number(button.dataset.colorIndex) : selectedColor;
      paletteName.textContent = copy.colors[index] ?? copy.paintLabel;
    },
    { signal },
  );

  palette.addEventListener(
    "pointerleave",
    () => {
      paletteName.textContent = copy.colors[selectedColor] ?? copy.paintLabel;
    },
    { signal },
  );

  palette.addEventListener(
    "focusout",
    (event) => {
      if (!(event.relatedTarget instanceof Node) || !palette.contains(event.relatedTarget)) {
        paletteName.textContent = copy.colors[selectedColor] ?? copy.paintLabel;
      }
    },
    { signal },
  );

  palette.addEventListener(
    "keydown",
    (event) => {
      const button = colorButtonFromEvent(event);
      if (!button) return;
      const currentIndex = Number(button.dataset.colorIndex);
      let nextIndex: number | null = null;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % colorButtons.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + colorButtons.length) % colorButtons.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = colorButtons.length - 1;
      }
      if (nextIndex === null) return;
      event.preventDefault();
      updateSelectedColor(nextIndex, true);
      colorButtons[nextIndex]?.focus({ preventScroll: true });
    },
    { signal },
  );

  undoButton.addEventListener("click", () => callbacks.onUndo(), { signal });
  redoButton.addEventListener("click", () => callbacks.onRedo(), { signal });
  randomButton.addEventListener(
    "click",
    () => {
      setMenuOpen(false);
      callbacks.onRandomTown();
    },
    { signal },
  );
  saveButton.addEventListener(
    "click",
    () => {
      setMenuOpen(false);
      callbacks.onSaveImage();
    },
    { signal },
  );

  menuButton.addEventListener("click", () => setMenuOpen(menuPanel.hidden, true), { signal });
  languageButton.addEventListener(
    "click",
    () => {
      const nextLocale: Locale = locale === "en" ? "vi" : "en";
      storeLocale(nextLocale);
      setMenuOpen(false);
      renderLocale(nextLocale);
      callbacks.onLanguageChange?.(nextLocale);
      announceStatus(copy.status.languageChanged);
    },
    { signal },
  );

  gridButton.addEventListener(
    "click",
    () => {
      gridEnabled = !gridEnabled;
      writeToggle(GRID_STORAGE_KEY, gridEnabled);
      updateToggleButton(gridButton, gridEnabled, copy.menu.gridHide, copy.menu.gridShow);
      callbacks.onToggleGrid?.(gridEnabled);
      announceStatus(gridEnabled ? copy.status.gridOn : copy.status.gridOff);
    },
    { signal },
  );

  soundButton.addEventListener(
    "click",
    () => {
      soundEnabled = !soundEnabled;
      updateToggleButton(soundButton, soundEnabled, copy.menu.soundOff, copy.menu.soundOn);
      callbacks.onToggleSound(soundEnabled);
      announceStatus(soundEnabled ? copy.status.soundOn : copy.status.soundOff);
    },
    { signal },
  );

  clearButton.addEventListener(
    "click",
    () => {
      setMenuOpen(false);
      callbacks.onClear();
    },
    { signal },
  );

  helpButton.addEventListener(
    "click",
    () => {
      const shouldOpen = helpCard.hidden;
      setMenuOpen(false);
      setHelpOpen(shouldOpen, true, shouldOpen);
    },
    { signal },
  );

  const dismissHelp = (): void => {
    rememberHelpDismissal();
    setHelpOpen(false, true);
    focusSoon(menuButton);
  };
  helpClose.addEventListener("click", dismissHelp, { signal });
  helpDismiss.addEventListener("click", dismissHelp, { signal });

  document.addEventListener(
    "pointerdown",
    (event) => {
      if (!menuPanel.hidden && event.target instanceof Node && !menu.contains(event.target)) {
        setMenuOpen(false);
      }
    },
    { signal },
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      if (!helpCard.hidden) {
        rememberHelpDismissal();
        setHelpOpen(false, true);
        focusSoon(menuButton);
        event.preventDefault();
      } else if (!menuPanel.hidden) {
        setMenuOpen(false);
        focusSoon(menuButton);
        event.preventDefault();
      }
    },
    { signal },
  );

  setHelpOpen(!wasHelpDismissed(), false);
  scheduleHintHide(4400);

  return {
    setColor(index: number): void {
      if (!disposed) updateSelectedColor(index, false);
    },
    setGrid(enabled: boolean): void {
      if (disposed) return;
      gridEnabled = enabled;
      writeToggle(GRID_STORAGE_KEY, enabled);
      updateToggleButton(gridButton, enabled, copy.menu.gridHide, copy.menu.gridShow);
    },
    setHistory(canUndo: boolean, canRedo: boolean): void {
      if (disposed) return;
      undoButton.disabled = !canUndo;
      redoButton.disabled = !canRedo;
    },
    setStatus(message: string): void {
      if (!disposed) announceStatus(message);
    },
    showHint(message: string): void {
      if (disposed) return;
      hint.textContent = message || getDefaultHint();
      hint.hidden = false;
      scheduleHintHide(message ? 3200 : 4400);
    },
    hideLoading(): void {
      if (disposed) return;
      const loading = document.getElementById("loading");
      if (!loading || loading.hidden || loading.classList.contains("is-leaving")) return;
      loading.setAttribute("aria-hidden", "true");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        loading.hidden = true;
        return;
      }
      const finish = (): void => {
        loading.hidden = true;
        window.clearTimeout(loadingTimer);
        loadingTimer = 0;
      };
      loading.classList.add("is-leaving");
      loading.addEventListener("transitionend", finish, { once: true, signal });
      loadingTimer = window.setTimeout(finish, 700);
    },
    dispose(): void {
      if (disposed) return;
      disposed = true;
      paletteResizeObserver.disconnect();
      listeners.abort();
      window.clearTimeout(loadingTimer);
      window.clearTimeout(statusTimer);
      window.clearTimeout(hintTimer);
      window.cancelAnimationFrame(focusFrame);
      root.classList.remove("hud-root");
      root.replaceChildren();
    },
  };
}
