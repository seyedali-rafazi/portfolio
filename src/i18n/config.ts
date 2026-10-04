"use client";

import i18next, { type i18n as I18nInstance } from "i18next";
import en from "./locales/en.json";
import fa from "./locales/fa.json";

export const defaultNS = "translation";
export const resources = {
  en: { translation: en },
  fa: { translation: fa },
} as const;

/**
 * Creates an isolated i18next instance already initialized with the given language.
 * Resources are bundled inline, so init is synchronous and no language change
 * is required during render.
 */
export function createI18n(lng: "en" | "fa"): I18nInstance {
  const instance = i18next.createInstance();
  instance.init({
    resources,
    lng,
    fallbackLng: "en",
    defaultNS,
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
  return instance;
}
