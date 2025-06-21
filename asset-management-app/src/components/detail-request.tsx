"use client"; 

import { useEffect, useState } from "react"; 
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IconCircleCheckFilled, IconCircleXFilled, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, RefreshCcw, Trash } from "lucide-react";
import { DeleteConfirmationDialog, deleteRequest } from "@/components/delete-confirmation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import API_CONFIG from "@/config/api";
import { RequestData } from "@/app/request/types";

async function getRequestData(id: string, token: string): Promise<RequestData | undefined> {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.get_request}`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ request_id: id }),
      cache: 'no-store'
    });
    if (!response.ok) return undefined;
    const responseData = await response.json();
    if (responseData.request && typeof responseData.request === 'object') {
      return responseData.request;
    }
    return undefined;
  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
    return undefined;
  }
}

function StatusBadge({ status }: { status: "waiting for approval" | "rejected" | "canceled" | "approved"; }) {
  if (status === "approved") {
    return <Badge variant="default" className="bg-green-500 text-md gap-2 flex items-center"> <IconCircleCheckFilled className="fill-white" /> Approved </Badge>;
  } else if (status === "rejected") {
    return <Badge variant="destructive" className="bg-red-500 text-md gap-2 flex items-center"> <IconCircleXFilled className="fill-white" /> Rejected</Badge>;
  } 
  return <Badge variant="secondary" className="text-md gap-2 flex items-center"> <IconLoader /> {status} </Badge>;
}


export function RequestDetailView({ requestId, token }: { requestId: string, token: string | undefined }) {
  
  const [request, setRequest] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

    console.log(requestId)
  
  useEffect(() => {
    if (!token) {
      setError("Token otentikasi tidak ditemukan.");
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const data = await getRequestData(requestId, token);
      if (data) {
        setRequest(data);
      } else {
        setError("Aset tidak ditemukan atau gagal mengambil data.");
      }
      setIsLoading(false);
    };

    fetchData();
  }, [requestId, token]); 

  console.log(request)
  

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

  if (!request) {
    return null; 
  }
  const handleDelete = async () => {
    try {
      await deleteRequest(request.request_id);
      toast.success(`Request dengan ID "${request.request_id}" berhasil dihapus.`);
      setTimeout(() => {
        router.push("/request/list_request");
      }, 1000); 
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
      console.error("Gagal menghapus aset dari tabel:", error);
      toast.error("Gagal Menghapus Aset", {
        description: errorMessage,
      });
    }
  };
//   const handleApproved = async () => {
//     try {
//       await approveRequest(request.request_id);
//       toast.success(`Request dengan ID "${request.request_id}" berhasil diapproved.`);
//       setTimeout(() => {
//         router.push("/request/list_request");
//       }, 1000); 
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
//       console.error("Gagal mengapproved request dari tabel:", error);
//       toast.error("Gagal Mengapproved Request", {
//         description: errorMessage,
//       });
//     }
//   };

  
  return (
    <Card className="mx-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl md:text-3xl">{request.request_id}</CardTitle>
            <CardDescription className="mt-2 text-sm">
              Asset ID: <Badge variant="outline" className="text-sm">{request.asset_id}</Badge>
            </CardDescription>
          </div>
          <StatusBadge status={request.status} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Reason</TableCell>
              <TableCell>{request.reason}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Request Date</TableCell>
              <TableCell>{
              (() => {
                const date = new Date(request.request_date); 
                if (isNaN(date.getTime())) {
                return "Invalid Date";
                }
                return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
              })()
              }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Created Date</TableCell>
              <TableCell>{
              (() => {
                const date = new Date(request.created_date); 
                if (isNaN(date.getTime())) {
                return "Invalid Date";
                }
                return `${dateFormatter.format(date)} ${timeFormatter.format(date)}`;
              })()
              }</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-muted-foreground">Last Updated</TableCell>
              <TableCell>{
              (() => {
                const date2 = new Date(request.update_at); 
                if (isNaN(date2.getTime())) {
                return "Invalid Date";
                }
                return `${dateFormatter.format(date2)} ${timeFormatter.format(date2)}`;
              })()
              }</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
      <div className="flex items-center justify-between px-4 pt-4 border-t">
        <div>
          <Link href="/request/list_request">
            <Button variant="outline" className="flex items-center gap-2"><ChevronLeft size={16}/> List Request </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <DeleteConfirmationDialog onConfirm={handleDelete}>
            <Button variant="destructive" className="flex items-center gap-2"><Trash size={16}/>Cancel</Button>
          </DeleteConfirmationDialog>
          {/* <ApproveConfirmationDialog onConfirm={handleApproved}>
            <Button className="flex items-center gap-2"><Check size={16}/>Approved</Button>
          </ApproveConfirmationDialog> */}
          <Link href={`/request/update_request/${request.request_id}`}>
            <Button className="flex items-center gap-2"><RefreshCcw size={16}/>Update</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}