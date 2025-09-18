"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayoutPaths = ["/custom-page", "/another-page"];
  const hideLayout = hideLayoutPaths.includes(pathname);

  return (
    <>
      {/* {!hideLayout && <Navbar />} */}
      <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
        {children}
      </main>
      {!hideLayout && (
        <footer className="w-full flex items-center justify-center py-3">
          {/* Footer content */}
        </footer>
      )}
    </>
  );
}
