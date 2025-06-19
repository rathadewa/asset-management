import API_CONFIG from '@/config/api';
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
import { DataTableRequest } from "@/components/data-table-request"
import { cookies } from 'next/headers';

async function getData() {
  const token = (await cookies()).get('token')?.value;
  if (!token) {
    throw new Error('Sesi tidak valid atau tidak ditemukan. Silakan login kembali.');
  }
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`;
  const response = await fetch(url, {
    headers: {
    'Authorization': `Bearer ${token}`
    },
    cache: 'no-store'
    });
  if (!response.ok) {
    throw new Error(`Gagal mengambil data, status: ${response.status}`);
  }
  const responseData = await response.json();
  return responseData.data || [];
}

export default async function Page() {
  const data = await getData();
  const data_request = JSON.parse(JSON.stringify(data));
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
                  <BreadcrumbLink href="#">
                    Request
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>List Request</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                    <DataTableRequest data={data_request} />
                    </div>
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
