"use client"

import { Card, CardContent } from "@/components/ui/card";
import API_CONFIG from "@/config/api";
import { useEffect, useState } from "react";
import { AssetData } from "@/app/asset/types";
import { AssetUpdateForm } from "./update-asset-form";

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

export function AssetUpdateView({ assetId, token }: { assetId: string, token: string | undefined }) {
  const [asset, setAsset] = useState<AssetData | null>(null);
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
    if (isLoading) {
        return <Card className="mx-4"><CardContent className="p-6">Memuat data aset...</CardContent></Card>;
    }

    if (error) {
        return <Card className="mx-4"><CardContent className="p-6 text-red-500">{error}</CardContent></Card>;
    }

    if (!asset) return null;

    return <AssetUpdateForm asset={asset} token={token} />;
}