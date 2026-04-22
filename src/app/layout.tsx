import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DataBee | פלטפורמת הסדרת פרטיות",
  description:
    "פלטפורמת הסדרת פרטיות לארגונים ישראליים לפי חוק הגנת הפרטיות",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="font-sans">
        <Header />
        <main className="mx-auto max-w-[1400px] px-6 py-8 md:px-10">
          {children}
        </main>
      </body>
    </html>
  );
}
