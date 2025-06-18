import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { notFound } from "next/navigation";
import { AssetDetailView } from "./asset-detail";
import API_CONFIG from "@/config/api";
import { Asset } from "./types";

async function getAssetData(id: string): Promise<Asset | undefined> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}/${id}`;
  
  try {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) {
      return undefined;
    }
    const responseData = await response.json();
    return responseData.data; 

  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
    return undefined;
  }
}

export default async function DetailAssetPage({ params }: { params: { assetId: string } }) {
  const { assetId } = params;
  const asset = await getAssetData(assetId);

  if (!asset) {
    notFound();
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
                  <BreadcrumbLink href="/asset/list_asset">
                    Asset
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Asset</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:py-6">
                <AssetDetailView asset={asset} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}