import { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SafeGo",
  description: "Voyage en toute sécurité",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
