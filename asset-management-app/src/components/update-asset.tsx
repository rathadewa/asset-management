"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ChevronLeft, X } from "lucide-react";
import type { Asset } from "./page";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import API_CONFIG from "@/config/api";
import { deleteAsset } from "./delete-confirmation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const categories = ["Laptop", "Hp", "Monitor", "Pointer"];
const statuses = ["Ready to Deploy", "Deployed", "Undeployed"];

const FormSchema = z.object({
  asset_name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  asset_id: z.string(),
  category: z.enum(categories, { 
    required_error: "Please select an asset category.",
  }),
  status: z.enum(statuses),
  location: z.string().min(4, {
    message: "Location must be at least 4 characters.",
  }),
})

async function getAssetData(id: string, token: string): Promise<Asset | undefined> {
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
  
  const [asset, setAsset] = useState<Asset | null>(null);
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

    if (!asset) {
        return null; 
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        asset_name: asset.asset_name,
        asset_id: asset.asset_id,
        category: asset.category,
        status: asset.status,
        location: asset.location,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("You submitted the following values", {
        description: (
            <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
        ),
        })
    }
  return (
    <Card className="mx-4">
        <Form {...form}>
            <CardHeader>
            <div className="flex justify-between items-start">
                <div>
                <CardTitle className="text-2xl md:text-3xl">Update Asset</CardTitle>
                <CardDescription className="mt-2 text-sm">
                </CardDescription>
                </div>
            </div>
            </CardHeader>
            <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
                <FormField
                control={form.control}
                name="asset_name"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-1 font-medium">Asset Name</FormLabel>
                    <div className="col-span-3">
                        <FormControl>
                        <Input placeholder="Input Asset Name.." {...field} />
                        </FormControl>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="asset_id"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-1 font-medium">Asset ID</FormLabel>
                    <div className="col-span-3">
                        <FormControl>
                        <Input {...field} disabled/>
                        </FormControl>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="category" 
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className=" col-span-1 font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                            {category}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status" 
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-1 font-medium">Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a Status" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                            {status}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                    <FormItem className="grid grid-cols-5 items-center gap-4">
                    <FormLabel className="col-span-1 font-medium">Location</FormLabel>
                    <div className="col-span-3">
                        <FormControl>
                        <Input placeholder="Input Asset Location.." {...field} />
                        </FormControl>
                        <FormMessage />
                    </div>
                    </FormItem>
                )}
                />
            </form>
        </CardContent>
        <div className="flex items-center justify-between px-4 pt-4 border-t">
        <div>
            <Link href="/asset/list_asset">
            <Button variant="outline" className="flex items-center gap-2" type="button"><ChevronLeft size={16}/> List Asset </Button>
            </Link>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()} > <X size={16}/>Cancel</Button>
            <Button className="submit"><Check size={16}/>Update</Button>
        </div>
        </div>
    </Form>
    </Card>
  );
}