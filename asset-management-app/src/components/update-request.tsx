"use client"

import { Card, CardContent } from "@/components/ui/card";
import API_CONFIG from "@/config/api";
import { useEffect, useState } from "react";
import { RequestData } from "@/app/request/types";
import { RequestUpdateForm } from "./update-request-form";

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

export function RequestUpdateView({ requestId, token }: { requestId: string, token: string | undefined }) {
  const [request, setRequest] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    if (isLoading) {
        return <Card className="mx-4"><CardContent className="p-6">Memuat data aset...</CardContent></Card>;
    }

    if (error) {
        return <Card className="mx-4"><CardContent className="p-6 text-red-500">{error}</CardContent></Card>;
    }

    if (!request) return null;

    return <RequestUpdateForm request={request} token={token} />;
}