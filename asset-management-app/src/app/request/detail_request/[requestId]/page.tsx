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
import { RequestDetailView } from "@/components/detail-request";
import { cookies } from "next/headers";

type DetailRequestPageProps = {
  params: { requestId: string }
};

export default async function DetailAssetPage(props: DetailRequestPageProps) {
  const params = await props.params;
  const requestId = params.requestId;

  if (!requestId) {
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
                  <BreadcrumbLink href="/asset/list_asset">
                    Request
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Detail Request</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:py-6">
                <RequestDetailView requestId ={requestId} token={token} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
  // return (
  //   <div style={{ padding: '40px', fontFamily: 'sans-serif', color: 'white', backgroundColor: 'black' }}>
  //     <h1>Halaman Debugging Detail Aset</h1>
  //     <p>Jika halaman ini muncul tanpa error di terminal, berarti deklarasi fungsi dan cara Anda menerima `requestId` sudah benar.</p>
  //     <p style={{ marginTop: '20px', fontSize: '24px' }}>
  //       {/* Asset ID yang diterima dari URL adalah: <strong>{asset.asset_id}</strong> */}
  //     </p>
  //   </div>
  // );
}