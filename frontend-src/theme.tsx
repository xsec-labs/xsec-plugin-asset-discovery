import { useEffect, useLayoutEffect, useState, type ReactNode } from "react";
import { ThemeProvider } from "@xsec/ui-react";
import { themeAttributes, type ThemeSettings } from "@xsec/design-tokens";
import type { PluginHost } from "./types";

type ColorMode = ThemeSettings["colorMode"];
const DARK_QUERY = "(prefers-color-scheme: dark)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const BASE_FONT_SIZE = 14;
const MIN_FONT_SCALE = 0.85;
const MAX_FONT_SCALE = 1.5;

function channels(value: string): [number, number, number] | undefined {
  const text = value.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3,8})$/.exec(text)?.[1];
  if (hex && (hex.length === 3 || hex.length === 4)) return [0, 1, 2].map(index => parseInt(hex[index] + hex[index], 16)) as [number, number, number];
  if (hex && (hex.length === 6 || hex.length === 8)) return [0, 2, 4].map(index => parseInt(hex.slice(index, index + 2), 16)) as [number, number, number];
  const rgb = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(text);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : undefined;
}

function luminance(value: string | undefined): number | undefined {
  const rgb = value ? channels(value) : undefined;
  return rgb ? (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255 : undefined;
}

/**
 * The Desktop host sends colors only (no color mode), so the mode comes from the
 * colors themselves: a surface darker than its text is a dark theme.
 */
export function resolveColorMode(theme: Record<string, string>, prefersDark: boolean): ColorMode {
  const declared = theme["color-mode"];
  if (declared === "light" || declared === "dark") return declared;
  const surface = luminance(theme["content-surface"]) ?? luminance(theme["window-background"]);
  const text = luminance(theme["text-primary"]);
  if (surface !== undefined && text !== undefined) return surface < text ? "dark" : "light";
  if (surface !== undefined) return surface < 0.5 ? "dark" : "light";
  if (text !== undefined) return text > 0.5 ? "dark" : "light";
  return prefersDark ? "dark" : "light";
}

export function resolveTheme(theme: Record<string, string>, prefersDark: boolean, prefersReducedMotion: boolean): ThemeSettings {
  const size = /^(\d+(?:\.\d+)?)px$/.exec(theme["ui-font-size"] ?? "");
  const scale = size ? Number(size[1]) / BASE_FONT_SIZE : 1;
  const motion = theme["reduce-motion"];
  const settings: ThemeSettings = {
    colorMode: resolveColorMode(theme, prefersDark),
    density: theme["ui-density"] === "comfortable" ? "comfortable" : "compact",
    fontScale: Math.min(MAX_FONT_SCALE, Math.max(MIN_FONT_SCALE, scale)),
    reducedMotion: motion === "true" || (motion !== "false" && prefersReducedMotion),
    locale: "zh-CN",
  };
  themeAttributes(settings);
  return settings;
}

const THEME_NAMES = ["color-mode", "ui-density", "ui-font-size", "reduce-motion", "content-surface", "window-background", "text-primary"];

function documentTheme(): Record<string, string> {
  const style = getComputedStyle(document.documentElement);
  return Object.fromEntries(THEME_NAMES.map(name => [name, style.getPropertyValue("--xsec-" + name).trim()]).filter(([, value]) => value));
}

function readTheme(theme: Record<string, string>): ThemeSettings {
  return resolveTheme(theme, window.matchMedia(DARK_QUERY).matches, window.matchMedia(MOTION_QUERY).matches);
}

export function PluginTheme({ host, children }: { host: PluginHost; children: ReactNode }) {
  const [settings, setSettings] = useState(() => readTheme(documentTheme()));
  useLayoutEffect(() => {
    const subscription = host.onTheme(theme => setSettings(readTheme({ ...documentTheme(), ...theme })));
    return () => subscription.dispose();
  }, [host]);
  useEffect(() => {
    const queries = [window.matchMedia(DARK_QUERY), window.matchMedia(MOTION_QUERY)];
    const refresh = () => setSettings(readTheme(documentTheme()));
    queries.forEach(query => query.addEventListener("change", refresh));
    return () => queries.forEach(query => query.removeEventListener("change", refresh));
  }, []);
  return <ThemeProvider settings={settings}>{children}</ThemeProvider>;
}
