"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AssetData } from "@/app/asset/types"
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Check, X } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import API_CONFIG from "@/config/api"
import { useRouter } from "next/navigation"
import { useState } from "react"

const categories = ["Notebook", "Imac", "Macbook", "Adaptor", "PC","Printer","External Disk","UPS","HDD","Camera","Scanner","Paper Shredder","PABX", "Mesin Absen", "Lemari es","Microwave","Dispenser","CCTV","TV","Software Adobe","Development Tools","Platform"];
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
});

export function AssetUpdateForm({ asset, token }: { asset: AssetData, token : string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      asset_name: asset.asset_name,
      asset_id: asset.asset_id,
      category: asset.category,
      status: asset.status,
      location: asset.location,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    if (!token) {
        toast.error("Authentication Error", { description: "Token not found. Please log in again." });
        setIsSubmitting(false);
        return;
    }
    if (!user || !user.name) {
        toast.error("Submission Failed", {
            description: "User information not available. Please try again.",
        });
        setIsSubmitting(false);
        return;
    }

    const payload = {
      ...data,
      updated_by: user.name, 
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to Update aset.");
      }

      toast.success("Asset Updated Successfully!", {
        description: `Asset "${payload.asset_name}" has been updated.`,
      });
      
      router.push(`/asset/detail_asset/${payload.asset_id}`);
      router.refresh();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      console.error("Error updating asset:", errorMessage);
      toast.error("Update Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl">Update Asset</CardTitle>
                        <CardDescription className="mt-2 text-sm">
                            Change data except Asset ID.
                        </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
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
                    <div className="flex items-center justify-between px-4 pt-4 border-t">
                        <Link href="/asset/list_asset">
                            <Button variant="outline" className="flex items-center gap-2" type="button">
                            <ChevronLeft size={16}/> List Asset
                            </Button>
                        </Link>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()}>
                            <X size={16}/>Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : <><Check size={16}/>Update</>}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Form>
    </Card>
  );
}

