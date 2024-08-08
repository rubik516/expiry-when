import { IntlProvider } from "react-intl";
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

  return (
    <IntlProvider
      locale="en"
      messages={English}
      defaultLocale="en"
      timeZone="Canada/Pacific"
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
