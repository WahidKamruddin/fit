import { AppNavbar } from "@/src/app/components/app-navbar";
import { ClosetProvider } from "@/src/app/providers/closetContext";

export default function loggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClosetProvider>
      <AppNavbar />
      <div className="h-full">
        {children}
      </div>
    </ClosetProvider>
  );
}
