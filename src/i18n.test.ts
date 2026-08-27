import { describe, expect, it } from "vitest";
import { getMessages, isLocale } from "./i18n";

describe("localization", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("vi")).toBe(true);
    expect(isLocale("ko")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it("keeps complete, distinct interface copy for all locales", () => {
    const english = getMessages("en");
    const vietnamese = getMessages("vi");
    const korean = getMessages("ko");

    expect(english.menu.title).toBe("Harbor tools");
    expect(vietnamese.menu.title).toBe("Công cụ bến cảng");
    expect(korean.menu.title).toBe("항구 도구");
    expect(english.help.desktopItems).toHaveLength(4);
    expect(vietnamese.help.desktopItems).toHaveLength(4);
    expect(korean.help.desktopItems).toHaveLength(4);
    expect(english.help.touchItems[0]?.[1]).toContain("building sides");
    expect(english.help.desktopItems[0]?.[1]).toContain("building sides");
    expect(vietnamese.help.touchItems[0]?.[1]).toContain("mặt bên tòa nhà");
    expect(vietnamese.help.desktopItems[0]?.[1]).toContain("mặt bên tòa nhà");
    expect(korean.help.touchItems[0]?.[1]).toContain("건물의 옆면");
    expect(korean.help.desktopItems[0]?.[1]).toContain("건물의 옆면");
    expect(english.colors).toHaveLength(vietnamese.colors.length);
    expect(english.colors).toHaveLength(korean.colors.length);
    expect(english.colors).not.toEqual(vietnamese.colors);
    expect(english.colors).not.toEqual(korean.colors);
  });

  it("interpolates translated paint names into accessible labels", () => {
    expect(getMessages("en").paintWith("Poppy")).toBe("Paint with Poppy");
    expect(getMessages("vi").paintWith("Đỏ anh túc")).toBe("Sơn bằng màu Đỏ anh túc");
    expect(getMessages("ko").paintWith("양귀비")).toBe("양귀비로 칠하기");
  });
});
