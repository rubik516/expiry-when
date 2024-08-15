import * as Localization from "expo-localization";
import { IntlProvider } from "react-intl";
import { NativeModules, Platform } from "react-native";
import { en, registerTranslation } from "react-native-paper-dates";

import "@formatjs/intl-getcanonicallocales/polyfill";
import "@formatjs/intl-locale/polyfill";

import "@formatjs/intl-pluralrules/polyfill";

import "@formatjs/intl-pluralrules/locale-data/en";

import "@formatjs/intl-numberformat/polyfill";

import "@formatjs/intl-numberformat/locale-data/en";

import "@formatjs/intl-datetimeformat/polyfill";

import "@formatjs/intl-datetimeformat/locale-data/en";

import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/contexts/DialogManagerContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import English from "@/localization/en.json";
import ProtectedApp from "@/navigations/ProtectedApp";

export default function App() {
  registerTranslation("en", en);

  const deviceLanguage =
    Platform.OS === "ios"
      ? NativeModules.SettingsManager.settings.AppleLocale // iOS
      : NativeModules.I18nManager.localeIdentifier; // Android
  const locale = deviceLanguage.split(/[-_]/)[0];

  const isLanguageSupported = (locale: string) => {
    try {
      Intl.DateTimeFormat.supportedLocalesOf(locale);
      return true;
    } catch (error) {
      console.log(`Locale is not supported: ${error}`);
      return false;
    }
  };

  return (
    <IntlProvider
      locale={isLanguageSupported(locale) ? locale : "en"}
      messages={English}
      defaultLocale="en"
      timeZone={Localization.getCalendars()[0].timeZone ?? "Canada/Pacific"}
    >
      <LoadingProvider>
        <DialogProvider>
          <AuthProvider>
            <ProtectedApp />
          </AuthProvider>
        </DialogProvider>
      </LoadingProvider>
    </IntlProvider>
  );
}
