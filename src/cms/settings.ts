// Runtime admin settings — persisted in a (non-httpOnly) cookie so both the
// client Settings panel and the server-rendered admin can read them. Values
// fall back to PolarisConfig.features when the cookie is absent.

import type { ResolvedConfig } from './config';

export const SETTINGS_COOKIE = 'polaris_settings';

export interface PolarisSettings {
  linkGenius: boolean;
}

export function defaultSettings(cfg: Pick<ResolvedConfig, 'features'>): PolarisSettings {
  return { linkGenius: cfg.features.linkGenius };
}

// Merge a raw cookie value over the defaults (tolerant of malformed cookies).
export function parseSettings(raw: string | undefined, defaults: PolarisSettings): PolarisSettings {
  if (!raw) return defaults;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<PolarisSettings>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}
