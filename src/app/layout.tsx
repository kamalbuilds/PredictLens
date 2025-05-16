import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "../../public/globals.css";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ConnectButton } from "@/components/connect-button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PredictLens",
  description: "Prediction markets powered by Lens Protocol",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased m-0 p-0 overflow-hidden`}>
        <Providers>
          <div>
            <div className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-sm border-b z-10 p-4">
              <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold flex items-center">
                  <span className="mr-2">🔮</span> PredictLens
                </Link>
                <div className="flex items-center gap-4">
                  <Link href="/markets" className="text-primary hover:underline">
                    Markets
                  </Link>
                  <Link href="/templates" className="text-primary hover:underline">
                    Templates
                  </Link>
                  <Link href="/profile" className="text-primary hover:underline">
                    Profile
                  </Link>
                  <ConnectButton />
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <main className="h-screen w-screen overflow-auto bg-background pt-16">
              <div className="max-w-7xl mx-auto p-4">
          
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
