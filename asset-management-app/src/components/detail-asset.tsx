"use client"; 

import { useEffect, useState } from "react"; 
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IconCircleCheckFilled, IconCircleXFilled, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, RefreshCcw, Trash } from "lucide-react";
import { deleteAsset, DeleteConfirmationDialog } from "@/components/delete-confirmation";
import { AssetData } from "@/app/asset/types";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import API_CONFIG from "@/config/api";


async function getAssetData(id: string, token: string): Promise<AssetData | undefined> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.get_asset}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ asset_id: id }),
      cache: 'no-store'
    });
    if (!response.ok) return undefined;
    const responseData = await response.json();
    if (responseData.asset && typeof responseData.asset === 'object') {
      return responseData.asset;
    }
    return undefined;
  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
    return undefined;
  }
}

function StatusBadge({ status }: { status: "Ready to Deployed" | "Deployed" | "Undeployed" }) {
  if (status === "Deployed") {
    return <Badge variant="default" className="bg-green-500 text-md gap-2 flex items-center"> <IconCircleCheckFilled className="fill-white" /> Deployed</Badge>;
  } else if (status === "Undeployed") {
    return <Badge variant="destructive" className="bg-red-500 text-md gap-2 flex items-center"> <IconCircleXFilled className="fill-white" /> Deployed</Badge>;
  } return <Badge variant="secondary" className="text-md gap-2 flex items-center"> <IconLoader /> Ready to Deployed </Badge>;
}


export function AssetDetailView({ assetId, token }: { assetId: string, token: string | undefined }) {
  
  const [asset, setAsset] = useState<AssetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  
  useEffect(() => {
    if (!token) {
      setError("Token otentikasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getAssetData(assetId, token);
      if (data) {
        setAsset(data);
      } else {
        setError("Aset tidak ditemukan atau gagal mengambil data.");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [assetId, token]); 

  

  const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  });
  const timeFormatter = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });

  
  if (isLoading) {
    return <Card className="mx-4"><CardContent className="p-6">Memuat data aset...</CardContent></Card>;
  }

  if (error) {
    return <Card className="mx-4"><CardContent className="p-6 text-red-500">{error}</CardContent></Card>;
  }

  if (!asset) {
    return null; 
  }
  const handleDelete = async () => {
    try {
      await deleteAsset(asset.asset_id);
      toast.success(`Aset "${asset.asset_name}" dengan ID "${asset.asset_id}" berhasil dihapus.`);
      setTimeout(() => {
        router.push("/asset/list_asset");
      }, 1000); 
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
      console.error("Gagal menghapus aset dari tabel:", error);
      toast.error("Gagal Menghapus Aset", {
        description: errorMessage,
      });
    }
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
          <StatusBadge status={asset.status} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Category</TableCell>
              <TableCell>{asset.category}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Location</TableCell>
              <TableCell>{asset.location}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Created Date</TableCell>
              <TableCell>{
              (() => {
                const date = new Date(asset.created_date);
                return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
              })()
              }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Last Updated</TableCell>
              <TableCell>{
              (() => {
                const date = new Date(asset.updated_at);
                return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
              })()
              }</TableCell>
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
          <Link href={`/asset/update_asset/${asset.asset_id}`}>
            <Button className="flex items-center gap-2"><RefreshCcw size={16}/>Update</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}