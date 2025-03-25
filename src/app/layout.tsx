import { Metadata } from "next";
import ReduxProvider from "@/redux/ReduxProvider";
import { AuthProvider } from "@/context/authContext";
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
      <head>
        <link rel="icon" href="/favicon.png" sizes="62x62" type="image/png" />
      </head>
      <body className="antialiased bg-gray-50 text-gray-900">
        <ReduxProvider>
          <AuthProvider>
            {" "}
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
