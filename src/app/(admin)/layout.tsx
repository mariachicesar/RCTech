"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect, useState } from "react";
import { supabase } from "../../superbase-client";
import Button from "../../components/ui/button/Button";
import { useRouter } from "next/navigation";
import { SWRConfig } from 'swr'
import { fetcher } from "../../hooks/fetcher";
import '@mdxeditor/editor/style.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [session, setSession] = useState<any>(null)

  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession()
    setSession(currentSession.data.session)
  }

  useEffect(() => {
    fetchSession()
  }, [])

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[290px]"
      : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex">
      {session ? (
        <SWRConfig
          value={{ fetcher }}
        >
          {/* Sidebar and Backdrop */}
          <AppSidebar />
          <Backdrop  />
          {/* Main Content Area */}
          <div
            className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
          >
            {/* Header */}
            <AppHeader session={session} />
            {/* Page Content */}
            <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
          </div>
        </SWRConfig>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center h-screen">
            <Button className="w-40" size="sm" onClick={() => router.push("/signin")}>
              Sign in
            </Button>
          </div>
        </>)
      }

    </div>
  );
}
