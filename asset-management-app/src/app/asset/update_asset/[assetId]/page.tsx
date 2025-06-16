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
import { AssetUpdateView } from "./asset-update";

export type Asset = {
  id: number;
  asset_name: string;
  asset_id: string;
  asset_category: string;
  asset_status: "In Process" | "Done";
  asset_location: string;
  asset_created: string;
  asset_updated: string;
};

async function getAssetData(id: string): Promise<Asset | undefined> {
  const filePath = path.join(process.cwd(), 'src', 'api', 'data.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: Asset[] = JSON.parse(fileContents);
    const asset = data.find(item => item.id === Number(id));
    return asset;
  } catch (error) {
    console.error("Gagal membaca atau parse data.json:", error);
    return undefined;
  }
}

export default async function UpdateAssetPage({ params }: { params: { assetId: string } }) {
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
                      <AssetUpdateView asset={asset} />
                    </div>
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}