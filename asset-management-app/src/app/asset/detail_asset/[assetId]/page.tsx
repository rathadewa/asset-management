import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import path from "path";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronLeft, RefreshCcw, Trash } from "lucide-react";

type Asset = {
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

function StatusBadge({ status }: { status: "In Process" | "Done" }) {
  if (status === "Done") {
    return <Badge variant="default" className="bg-green-600 text-md"> <IconCircleCheckFilled className="fill-wite-500 dark:fill-wite-400" /> Done</Badge>;
  }
  return <Badge variant="secondary" className="text-md"> <IconLoader /> In Process</Badge>;
}

export default async function DetailAssetPage({ params }: { params: { assetId: string } }) {
  const { assetId } = params; 
  const asset = await getAssetData(assetId);

  if (!asset) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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
                      <Card className="mx-4">
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-2xl md:text-3xl">{asset.asset_name}</CardTitle>
                              <CardDescription className="mt-2 text-sm">
                                Asset ID: <Badge variant="outline" className="text-sm">{asset.asset_id}</Badge>
                              </CardDescription>
                            </div>
                            <StatusBadge status={asset.asset_status} />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Category</TableCell>
                                <TableCell>{asset.asset_category}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Location</TableCell>
                                <TableCell>{asset.asset_location}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Created Date</TableCell>
                                <TableCell>{formatDate(asset.asset_created)}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Last Updated</TableCell>
                                <TableCell>{formatDate(asset.asset_updated)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </CardContent>
                        <div className="flex items-center justify-between px-4 lg:px-6">
                          <div>
                            <Link href="/asset/list_asset">
                              <Button variant="secondary"><ChevronLeft/> List Asset </Button>
                            </Link>
                          </div>
                          <div className="flex gap-2">
                            <Link href="#">
                              <Button variant="destructive"><Trash/>Delete</Button>
                            </Link>
                            <Link href="#">
                              <Button><RefreshCcw/>Update</Button>
                            </Link>
                          </div>
                        </div>
                      </Card>
                    </div>
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
