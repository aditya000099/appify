import AuthProvider from "./components/SessionProvider";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Other import statements

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Appify",
  description:
    " Your trusted platform for finding and distributing exceptional applications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
