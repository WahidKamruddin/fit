import { AppSidebar } from "@/src/app/components/app-sidebar";
import { Separator } from "@/src/app/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/app/components/ui/sidebar";

import { ClosetProvider } from "@/src/app/providers/closetContext";


export default function loggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClosetProvider>
    <SidebarProvider >
      <AppSidebar />
      <SidebarInset>
        <header className="absolute flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-off-white-100">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="z-30 -ml-1 cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            {/* TODO: Need to get this breadcrumb working
                  
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href="#">
                          Building Your Application
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator className="hidden md:block" />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb> */}
          </div>
        </header>
        <div className="h-full">
          {children}
          </div>
      </SidebarInset>
    </SidebarProvider>
    </ClosetProvider>
  );
}