import GridShape from "@/components/common/GridShape";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";

import { ThemeProvider } from "@/context/ThemeContext";
import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="lg:w-1/2 w-full h-full bg-brand-950 dark:bg-white/5 lg:grid items-center hidden">
            <div className="relative items-center justify-center  flex z-1">
              {/* <!-- ===== Common Grid Shape Start ===== --> */}
              <GridShape />
              <div className="flex flex-col items-center max-w-xs">
                <Link href="/" className="block mb-6">
                  {/* RC Tech Bridge Logo */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-4xl font-bold text-[#CD7F32]">R</span>
                      <div className="w-10 h-0.5 bg-[#C41E3A] rounded-full"></div>
                      <span className="text-4xl font-bold text-[#CD7F32]">C</span>
                    </div>
                    <div className="flex flex-col leading-tight">
                      <span className="text-[#CD7F32] font-bold text-lg tracking-wide">TECH</span>
                      <span className="text-[#C41E3A] font-bold text-lg tracking-wide -mt-1">BRIDGE</span>
                    </div>
                  </div>
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60 text-sm leading-relaxed">
                  Bridging Business & Technology<br />
                  <span className="text-xs">Secure Admin Access Portal</span>
                </p>
              </div>
            </div>
          </div>
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
