"use client"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronLeft, Check, X } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import API_CONFIG from "@/config/api"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { RequestData } from "@/app/request/types"
import { Textarea } from "./ui/textarea"

const statuses = ["waiting for approval", "rejected", "cancelled", "approved"];

const FormSchema = z.object({
    request_id: z.string(),
    asset_id: z.string(),
    status: z.enum(statuses),
    reason: z.string().min(2, "Reason must be at least 4 characters"),
    request_date: z.string()
});

export function RequestUpdateForm({ request, token }: { request: RequestData, token : string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      request_id: request.request_id,
      asset_id: request.asset_id,
      status: request.status,
      reason: request.reason,
      request_date: request.request_date,
    },
  });

  async function getAssetData(id: string, token: string){
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

// async function onSubmit(data: z.infer<typeof FormSchema>) {
//     setIsSubmitting(true);

//     if (!token) {
//         toast.error("Authentication Error", { description: "Token not found. Please log in again." });
//         setIsSubmitting(false);
//         return;
//     }
//     if (!user || !user.name) {
//         toast.error("Submission Failed", {
//             description: "User information not available. Please try again.",
//         });
//         setIsSubmitting(false);
//         return;
//     }

//     const payload = {
//       ...data,
//       created_by: request.created_by, 
//       updated_by: user.name, 
//     };

//     try {
//       const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`, {
//         method: 'PUT', 
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, 
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(result.message || "Failed to Update aset.");
//       }

//       toast.success("Request Updated Successfully!", {
//         description: `Request "${payload.request_id}" has been updated.`,
//       });
      
//       router.push(`/request/detail_request/${payload.request_id}`);
//       router.refresh();

//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
//       console.error("Error updating Request:", errorMessage);
//       toast.error("Update Failed", {
//         description: errorMessage,
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   }
//
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true);

        if (!token || !user?.name) {
            toast.error("Authentication Error", { description: "User or token not found." });
            setIsSubmitting(false);
            return;
        }

        
        const requestPayload = {
        ...data,
        request_date: new Date(data.request_date).toLocaleDateString('en-CA'), 
        created_by: request.created_by, 
        updated_by: user.name,
        };
        console.log("Payload untuk UPDATE yang akan dikirim:", requestPayload);

        try {
        
        const requestResponse = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`, {
            method: 'PUT', 
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(requestPayload),
        });

        const requestResult = await requestResponse.json();

        if (!requestResponse.ok) {
            throw new Error(requestResult.message || "Failed to update request.");
        }

        toast.success("Request Updated Successfully!", {
            description: `Request "${requestPayload.request_id}" has been updated.`,
        });

        
        if (data.status === 'approved') {
            toast.info("Request approved, attempting to update asset status...");
            try {
            
            const currentAsset = await getAssetData(data.asset_id, token);

            
            const assetPayload = {
                ...currentAsset, 
                status: "Deployed", 
                updated_by: user.name, 
            };

            
            const assetResponse = await fetch(`${API_CONFIG.BASE_URL}/api/assets`, {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(assetPayload),
            });
            
            if (!assetResponse.ok) {
                throw new Error('Asset status update failed after request approval.');
            }

            toast.success("Asset Status Updated!", {
                description: `Asset ${data.asset_id} has been set to Deployed.`,
            });

            } catch (assetError) {
            
            const errorMessage = assetError instanceof Error ? assetError.message : "An unexpected error occurred.";
            console.error("Error updating asset:", errorMessage);
            toast.error("Asset Update Failed", { description: errorMessage });
            }
        }
        
        router.push(`/request/detail_request/${requestPayload.request_id}`);
        router.refresh();

        } catch (error) {
        
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        console.error("Error updating Request:", errorMessage);
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
                    <CardTitle className="text-2xl md:text-3xl">Update Request</CardTitle>
                        <CardDescription className="mt-2 text-sm">
                            Change data except Request ID.
                        </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                        <FormField
                        control={form.control}
                        name="request_id"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-5 items-center gap-4">
                            <FormLabel className="col-span-1 font-medium">Request ID</FormLabel>
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
                        name="reason"
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-5 items-start gap-4">
                            <FormLabel className="col-span-1 font-medium pt-2">Reason</FormLabel>
                            <div className="col-span-3">
                                <FormControl>
                                <Textarea
                                    placeholder="Tell us the reason for this request"
                                    className="resize-y"
                                    {...field}
                                />
                                </FormControl>
                                <FormMessage />
                            </div>
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
                    <div className="flex items-center justify-between px-4 pt-4 border-t">
                        <Link href="/request/list_request">
                            <Button variant="outline" className="flex items-center gap-2" type="button">
                            <ChevronLeft size={16}/> List request
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

