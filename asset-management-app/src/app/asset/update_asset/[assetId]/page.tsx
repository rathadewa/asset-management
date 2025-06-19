import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import path from "path";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { AssetUpdateView } from "@/components/update-asset";

type UpdateAssetPageProps = {
  params: { assetId: string }
};

export default async function DetailAssetPage(props: UpdateAssetPageProps) {
  const params = await props.params;
  const assetId = params.assetId;
  
  if (!assetId) {
    notFound();
  }
  
  const token = (await cookies()).get('token')?.value;

  if (!token) {
    console.error("Token otentikasi tidak ditemukan.");
    return undefined;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/asset/zlist_asset">
                    Asset
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Update Asset</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:py-6">
                      <AssetUpdateView assetId={assetId} token={token} />
                    </div>
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}