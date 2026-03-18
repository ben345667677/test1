import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Starter Studio | סוכנות דיגיטל וטכנולוגיה",
  description: "אנחנו יוצרים אתרים מעוצבים, אוטומציות חכמות ופתרונות מותאמים אישית שמקדמים את העסק שלך לשלב הבא.",
  keywords: ["סוכנות דיגיטל", "פיתוח אתרים", "אוטומציות AI", "צ'אטבוטים", "עיצוב אתרים", "ישראל"],
  authors: [{ name: "Starter Studio" }],
  icons: {
    icon: "./logo.svg",
  },
  openGraph: {
    title: "Starter Studio | סוכנות דיגיטל וטכנולוגיה",
    description: "אנחנו יוצרים אתרים מעוצבים, אוטומציות חכמות ופתרונות מותאמים אישית",
    type: "website",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground">
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
