import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/component/header";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wibu Social",
  description: "Generated by Tu",
  keywords: "facebook, fb, clone, fb clone, facebook fake,clone fb",
  other: {
    "google-site-verification": "NBGQlDYXMfm6ev4Q6bzCQgv0GNO4Ebxyw8-ALuGWND8",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header></Header>
        <div className="body">{children}</div>
      </body>
    </html>
  );
}
