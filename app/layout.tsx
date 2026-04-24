import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "DataBee | פלטפורמת הסדרת פרטיות",
  description:
    "פלטפורמה לניהול הסדרת פרטיות לארגונים ישראליים - עמידה בחוק הגנת הפרטיות ותקנות אבטחת מידע.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className="min-h-screen">
        <SiteHeader />
        <main id="app" className="min-h-[calc(100vh-56px)]">
          {children}
        </main>
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-7 py-3 text-white"
      style={{
        background: "var(--color-navy)",
        boxShadow: "0 2px 12px rgba(0,0,0,.12)",
      }}
    >
      <a
        href="/"
        className="flex items-center gap-2.5 text-[19px] font-bold cursor-pointer"
      >
        <span
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] text-[16px] font-extrabold"
          style={{ background: "var(--color-gold)", color: "var(--color-navy)" }}
        >
          D
        </span>
        <span>DataBee</span>
      </a>
      <div className="text-[13px]" style={{ color: "rgba(255,255,255,.6)" }}>
        פלטפורמת הסדרת פרטיות
      </div>
    </header>
  );
}
