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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ChevronLeft, Plus, RefreshCcw, Trash } from "lucide-react";

export default async function DetailAssetPage() {
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
                  <BreadcrumbPage>Add Asset</BreadcrumbPage>
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
                              <CardTitle className="text-2xl md:text-3xl">Add Asset</CardTitle>
                              <CardDescription className="mt-2 text-sm">
                                {/* Asset ID: <Badge variant="outline" className="text-sm">{asset.asset_id}</Badge> */}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Asset Name</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Asset ID</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Category</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Status</TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium text-muted-foreground">Location</TableCell>
                                <TableCell></TableCell>
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
                              <Button variant="secondary"><Trash/>Cancal</Button>
                            </Link>
                            <Link href="#">
                              <Button><Plus/>Submit</Button>
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
