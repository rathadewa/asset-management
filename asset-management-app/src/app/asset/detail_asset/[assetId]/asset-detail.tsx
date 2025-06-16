"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, RefreshCcw, Trash } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/delete-confirmation";
import type { Asset } from "./types";

function StatusBadge({ status }: { status: "Ready to Deployed" | "Deployed" }) {

  if (status === "Deployed") {
    return <Badge variant="default" className="bg-green-600 text-md gap-2 flex items-center"> <IconCircleCheckFilled className="fill-white" /> Deployed</Badge>;
  }
  return <Badge variant="secondary" className="text-md gap-2 flex items-center"> <IconLoader /> Ready to Deployed </Badge>;
}

export function AssetDetailView({ asset }: { asset: Asset }) {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDelete = () => {
    console.log(`Menghapus aset dengan ID: ${asset.id}`);
    //API
    alert(`Aset "${asset.asset_name}" telah dihapus.`);
  };

  return (
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
      <div className="flex items-center justify-between px-4 pt-4 border-t">
        <div>
          <Link href="/asset/list_asset">
            <Button variant="outline" className="flex items-center gap-2"><ChevronLeft size={16}/> List Asset </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <DeleteConfirmationDialog onConfirm={handleDelete}>
            <Button variant="destructive" className="flex items-center gap-2"><Trash size={16}/>Delete</Button>
          </DeleteConfirmationDialog>
          <Link href={`/asset/update_asset/${asset.id}`}>
            <Button className="flex items-center gap-2"><RefreshCcw size={16}/>Update</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}