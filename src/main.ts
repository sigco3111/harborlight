import "./style.css";
import { Soundscape } from "./audio";
import { PALETTE } from "./config";
import { TownRenderer } from "./renderer";
import { applyDocumentLocale, getInitialLocale, getMessages, type Locale } from "./i18n";
import type { CellPick, HudController } from "./types";
import { createHud } from "./ui";
import { WorldModel } from "./world";

const canvas = document.querySelector<HTMLCanvasElement>("#world");
const hudRoot = document.querySelector<HTMLElement>("#hud");

if (!canvas || !hudRoot) {
  throw new Error("Harborlight could not find its canvas or interface root.");
}

let locale: Locale = getInitialLocale();
let copy = getMessages(locale);
applyDocumentLocale(locale);
canvas.tabIndex = 0;
const readPreference = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writePreference = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Private browsing can deny storage without blocking the toy.
  }
};
const WORLD_STORAGE_KEY = "harborlight-world.v1";
const world = new WorldModel();
const sound = new Soundscape();
let renderer: TownRenderer;
let hud: HudController;
let selectedColor = Number.parseInt(readPreference("harborlight-color") ?? "0", 10);
if (!Number.isInteger(selectedColor) || selectedColor < 0 || selectedColor >= PALETTE.length) selectedColor = 0;

const hashTown = location.hash.length > 1 ? location.hash.slice(1) : "";
const savedTown = readPreference(WORLD_STORAGE_KEY);
let initialWorldSource: "hash" | "local" | "default" = "default";
if (hashTown && world.deserialize(hashTown, false)) {
  initialWorldSource = "hash";
} else if (savedTown && world.deserialize(savedTown, false)) {
  initialWorldSource = "local";
} else {
  world.seedDefault();
}

let currentHover: CellPick | null = null;
let pointerDragged = false;
let activePointer: number | null = null;
let pinchDistance = 0;
const pointers = new Map<number, { x: number; y: number; downAt: number }>();
let holdTimer = 0;
let holdArmed = false;
let frame = 0;

const saveWorld = (): void => {
  const encoded = world.serialize();
  writePreference(WORLD_STORAGE_KEY, encoded);
  if (location.hash.slice(1) !== encoded) history.replaceState(null, "", `#${encoded}`);
};

const syncWorld = (animate = true): void => {
  renderer.sync(world.snapshot(), animate);
  hud.setHistory(world.canUndo(), world.canRedo());
  saveWorld();
};

const announceColor = (): void => {
  const color = PALETTE[selectedColor];
  if (!color) return;
  hud.setColor(selectedColor);
  hud.setStatus(copy.status.paintSelected(copy.colors[selectedColor] ?? color.name));
  renderer.setHover(currentHover, selectedColor, false);
};

const mutateAt = (pick: CellPick, remove: boolean): void => {
  const beforeCell = world.getCell(pick.x, pick.z);
  const beforeHeight = beforeCell?.level ?? 0;
  const beforeFeature = world.snapshot().features.find((feature) => feature.id === pick.id);
  const changed = remove
    ? world.remove(pick.x, pick.z, pick.face === "side" && pick.level > 0 ? pick.level : undefined)
    : world.add(pick.x, pick.z, selectedColor, pick.placementLevel);
  if (!changed) {
    sound.ui(190);
    hud.showHint(remove ? copy.status.nothingToRemove : copy.status.towerLimit);
    return;
  }

  const afterCell = world.getCell(pick.x, pick.z);
  const afterFeature = world.snapshot().features.find((feature) => feature.id === pick.id);
  if (remove) {
    sound.remove(beforeHeight);
    hud.setStatus(copy.status.buildingRemoved);
  } else {
    const placedFoundation = beforeCell === undefined && pick.placementLevel === undefined;
    if (placedFoundation) sound.foundation(selectedColor);
    else sound.build(selectedColor, afterCell?.level ?? beforeHeight + 1);
    if (afterFeature?.kind === "bridge" && beforeFeature?.kind !== "bridge") {
      sound.bridge(afterFeature.bridgeSpan?.length ?? 1);
    }
    hud.setStatus(placedFoundation ? copy.status.foundationPlaced : copy.status.storeyAdded);
  }
  const startledBirds = renderer.notifyConstruction(pick.x, pick.z);
  syncWorld();
  sound.water(remove ? 0.48 : pick.kind === "water" ? 0.92 : 0.58);
  if (startledBirds) sound.birdTakeoff();
  currentHover = renderer.pick(lastPointerX, lastPointerY, !remove);
  renderer.setHover(currentHover, selectedColor, remove);
};

hud = createHud(hudRoot, {
  onColor(index) {
    selectedColor = index;
    writePreference("harborlight-color", String(index));
    sound.ui(440 + index * 18);
    announceColor();
  },
  onUndo() {
    if (!world.undo()) return;
    sound.ui("undo");
    syncWorld();
    hud.setStatus(copy.status.undone);
  },
  onRedo() {
    if (!world.redo()) return;
    sound.ui("redo");
    syncWorld();
    hud.setStatus(copy.status.restored);
  },
  onClear() {
    if (world.snapshot().cells.length === 0) return;
    world.clear();
    sound.remove(1);
    syncWorld(false);
    hud.setStatus(copy.status.townCleared);
  },
  onRandomTown() {
    world.randomTown(Date.now() & 0x7fffffff);
    sound.ui(620);
    syncWorld(false);
    hud.setStatus(copy.status.randomTown);
  },
  onSaveImage() {
    sound.ui("save");
    renderer.capture();
    hud.setStatus(copy.status.postcardReady);
  },
  onToggleSound(enabled) {
    sound.setEnabled(enabled);
    if (enabled) sound.ui("open");
  },
  onToggleHelp() {
    sound.ui("open");
  },
  onToggleGrid(enabled) {
    if (renderer) renderer.setGrid(enabled);
    sound.ui(enabled ? "grid-on" : "grid-off");
  },
  onLanguageChange(nextLocale) {
    locale = nextLocale;
    copy = getMessages(locale);
    applyDocumentLocale(locale);
    sound.ui("open");
  },
});

try {
  renderer = new TownRenderer(canvas);
} catch (error) {
  const message = error instanceof Error ? error.message : copy.webglError;
  const loading = document.getElementById("loading");
  if (loading) {
    loading.hidden = true;
    loading.setAttribute("aria-hidden", "true");
  }
  hudRoot.innerHTML = `<section class="fatal" role="alert"><strong>${copy.fatalTitle}</strong><span>${message}</span></section>`;
  throw error;
}
const initialGridEnabled = readPreference("harborlight-grid") === "on";
renderer.setGrid(initialGridEnabled);

syncWorld(false);
hud.setColor(selectedColor);
hud.setHistory(world.canUndo(), world.canRedo());
if (initialWorldSource === "local") hud.setStatus(copy.status.savedHarborRestored);

let lastPointerX = innerWidth / 2;
let lastPointerY = innerHeight / 2;

canvas.addEventListener("pointerdown", (event) => {
  sound.unlock();
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY, downAt: performance.now() });
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add("is-orbiting");

  if (pointers.size === 1) {
    activePointer = event.pointerId;
    pointerDragged = false;
    renderer.beginPointer(event.clientX, event.clientY);
    holdArmed = false;
    window.clearTimeout(holdTimer);
    if (event.pointerType === "touch") {
      const pointerId = event.pointerId;
      holdTimer = window.setTimeout(() => {
        if (activePointer !== pointerId || pointerDragged || pointers.size !== 1) return;
        const point = pointers.get(pointerId);
        if (!point) return;
        const candidate = renderer.pick(point.x, point.y);
        if (!candidate || world.getCell(candidate.x, candidate.z) === undefined) return;
        holdArmed = true;
        currentHover = candidate;
        renderer.setHover(candidate, selectedColor, true);
        canvas.classList.add("is-removing");
      }, 380);
    }
  } else {
    renderer.endPointer();
    activePointer = null;
    pointerDragged = true;
    window.clearTimeout(holdTimer);
    holdArmed = false;
    canvas.classList.remove("is-removing");
    const [first, second] = [...pointers.values()];
    pinchDistance = first && second ? Math.hypot(first.x - second.x, first.y - second.y) : 0;
  }
});

canvas.addEventListener("pointermove", (event) => {
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  const tracked = pointers.get(event.pointerId);
  if (tracked) {
    tracked.x = event.clientX;
    tracked.y = event.clientY;
  }

  if (pointers.size >= 2) {
    const [first, second] = [...pointers.values()];
    if (first && second) {
      const nextDistance = Math.hypot(first.x - second.x, first.y - second.y);
      if (pinchDistance > 0) renderer.zoom((pinchDistance - nextDistance) * 1.7);
      pinchDistance = nextDistance;
      pointerDragged = true;
    }
  } else if (activePointer === event.pointerId) {
    const movement = renderer.movePointer(event.clientX, event.clientY);
    pointerDragged ||= movement.dragged;
    if (pointerDragged) {
      window.clearTimeout(holdTimer);
      holdArmed = false;
      canvas.classList.remove("is-removing");
    }
  }

  currentHover = renderer.pick(event.clientX, event.clientY, !event.shiftKey);
  renderer.setHover(pointerDragged ? null : currentHover, selectedColor, event.shiftKey);
});

const finishPointer = (event: PointerEvent, cancelled = false): void => {
  const tracked = pointers.get(event.pointerId);
  if (!tracked) return;
  const wasSolePointer = pointers.size === 1;
  const wasActivePointer = activePointer === event.pointerId;
  const longPress = holdArmed;
  window.clearTimeout(holdTimer);
  holdArmed = false;
  canvas.classList.remove("is-removing");
  pointers.delete(event.pointerId);

  if (wasSolePointer && wasActivePointer) {
    renderer.endPointer();
    const remove = event.button === 2 || event.shiftKey || longPress;
    if (!cancelled && !pointerDragged) {
      const pick = renderer.pick(event.clientX, event.clientY, !remove);
      if (pick) mutateAt(pick, remove);
    }
  }

  const remaining = pointers.entries().next().value as [number, { x: number; y: number; downAt: number }] | undefined;
  if (remaining) {
    activePointer = remaining[0];
    pointerDragged = true;
    renderer.beginPointer(remaining[1].x, remaining[1].y);
  } else {
    activePointer = null;
    pinchDistance = 0;
    pointerDragged = false;
    canvas.classList.remove("is-orbiting");
  }
};

canvas.addEventListener("pointerup", (event) => finishPointer(event));
canvas.addEventListener("pointercancel", (event) => finishPointer(event, true));
canvas.addEventListener("pointerleave", () => {
  if (activePointer === null) {
    currentHover = null;
    renderer.setHover(null, selectedColor, false);
  }
});
canvas.addEventListener("contextmenu", (event) => event.preventDefault());
canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
  renderer.zoom(event.deltaY * unit);
}, { passive: false });

document.addEventListener("keydown", (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.matches("input, textarea, select")) return;
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "z") {
    event.preventDefault();
    const restored = event.shiftKey ? world.redo() : world.undo();
    if (restored) {
      syncWorld();
      hud.setStatus(event.shiftKey ? copy.status.restored : copy.status.undone);
    }
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "y") {
    event.preventDefault();
    if (world.redo()) {
      syncWorld();
      hud.setStatus(copy.status.restored);
    }
    return;
  }
  if (event.key >= "1" && event.key <= "9") {
    const index = Number(event.key) - 1;
    if (index < PALETTE.length) {
      selectedColor = index;
      writePreference("harborlight-color", String(index));
      sound.ui(440 + index * 18);
      announceColor();
    }
  }
});

window.addEventListener("hashchange", () => {
  const encoded = location.hash.slice(1);
  if (encoded && world.deserialize(encoded)) {
    renderer.sync(world.snapshot(), false);
    hud.setHistory(world.canUndo(), world.canRedo());
    writePreference(WORLD_STORAGE_KEY, encoded);
    hud.setStatus(copy.status.sharedHarborLoaded);
  }
});
window.addEventListener("resize", () => renderer.resize(), { passive: true });

const loadingFallback = window.setTimeout(() => hud.hideLoading(), 2800);
const animate = (time: number): void => {
  renderer.update(time);
  if (frame < 2) {
    frame += 1;
    if (frame === 2) {
      window.clearTimeout(loadingFallback);
      hud.hideLoading();
    }
  }
  requestAnimationFrame(animate);
};
requestAnimationFrame(animate);

window.addEventListener("beforeunload", () => {
  renderer.dispose();
  sound.dispose();
  hud.dispose();
}, { once: true });
