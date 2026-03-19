import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider"
import LenisProvider from "./providers/LenisProvider"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Diogo — Portfolio",
  description: "Junior Software Engineer",
};

export default function RootLayout({ children }) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <LenisProvider>

            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Footer />
            </ThemeProvider>
          </LenisProvider>
        </body>
      </html>
    </>
  )
}
