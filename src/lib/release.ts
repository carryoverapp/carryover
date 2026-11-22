import { useEffect, useState } from "react";

export const REPO = "FarazAhmadNagrami/carryover-app";
export const RELEASES_URL = `https://github.com/${REPO}/releases`;
export const ISSUES_URL = `https://github.com/${REPO}/issues`;

/** Stable asset names, so /releases/latest/download/<name> always works. */
export const ASSETS = {
  windows: "Carryover-Windows-x64-setup.exe",
  mac: "Carryover-macOS-universal.dmg",
} as const;

export const downloadUrl = (name: string) => `${RELEASES_URL}/latest/download/${name}`;

export type Release = { version: string | null; hasMac: boolean };

/** Reads the latest release once; the page works without it (Windows link is stable). */
export function useRelease(): Release {
  const [rel, setRel] = useState<Release>({ version: null, hasMac: false });
  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then((r) => (r.ok ? r.json() : null))
      .then((r: { tag_name?: string; assets?: { name: string }[] } | null) => {
        if (!r) return;
        setRel({
          version: r.tag_name?.replace(/^v/, "") ?? null,
          hasMac: !!r.assets?.some((a) => a.name === ASSETS.mac),
        });
      })
      .catch(() => {});
  }, []);
  return rel;
}

export function detectOs(): "windows" | "mac" | "other" {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "windows";
  if (/Macintosh|Mac OS X/i.test(ua) && !/iPhone|iPad/i.test(ua)) return "mac";
  return "other";
}
