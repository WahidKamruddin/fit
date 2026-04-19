'use client'

import { Suspense, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AppNavbar } from "@/src/app/components/app-navbar";
import { ClosetProvider } from "@/src/app/providers/closetContext";
import { SocialProvider } from "@/src/app/providers/socialContext";
import { MessagesProvider } from "@/src/app/providers/messagesContext";

function CodeCleaner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('code')) {
      router.replace(pathname);
    }
  }, []);

  return null;
}

export default function loggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClosetProvider>
      <SocialProvider>
        <MessagesProvider>
          <AppNavbar />
          <Suspense>
            <CodeCleaner />
          </Suspense>
          <div className="h-full">
            {children}
          </div>
        </MessagesProvider>
      </SocialProvider>
    </ClosetProvider>
  );
}
