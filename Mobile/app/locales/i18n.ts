import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./en.json";
import fr from "./fr.json";
import rw from "./rw.json";

const deviceLanguage =
  Localization.getLocales()[0]?.languageCode || "en"; // 👈 correct way now

i18n
  .use(initReactI18next)
  .init({
    lng: deviceLanguage, // auto-detect
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      rw: { translation: rw },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
