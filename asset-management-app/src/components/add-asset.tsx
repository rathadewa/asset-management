"use client"; 

import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_CONFIG from "@/config/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

const categories = ["Laptop", "Hp", "Monitor", "Pointer", "Elektronik"] as const;
const statuses = ["Ready to Deploy", "Deployed", "Undeployed"] as const;

const FormSchema = z.object({
  asset_name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  category: z.string().min(1, { message: "Please select an asset category." }),
  status: z.enum(statuses),
  location: z.string().min(4, { message: "Location must be at least 4 characters." }),
});


export function AddAssetView({ token }: { token: string | undefined }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useUser();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      asset_name: "",
      category: "",
      status: "Ready to Deploy",
      location: "",
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
      asset_name: data.asset_name,
      category: data.category,
      status: data.status,
      location: data.location,
      created_by: user.name, 
      updated_by: user.name,
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to add asset");
      }
      toast.success("Asset added successfully!", {
        description: `Asset ${payload.asset_name} has been saved.`,
      });
      router.push('/asset/list_asset');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      console.error("Error submitting form:", errorMessage);
      toast.error("Submission Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }
    return(
        <Card className="mx-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
                <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                    <CardTitle className="text-2xl md:text-3xl">Add Asset</CardTitle>
                    <CardDescription className="mt-2 text-sm">
                      Fill out the form below to create a new asset.
                    </CardDescription>
                    </div>
                </div>
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
                    {/* <FormField
                    control={form.control}
                    name="asset_id"
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className="col-span-1 font-medium">Asset ID</FormLabel>
                        <div className="col-span-3">
                            <FormControl>
                            <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </div>
                        </FormItem>
                    )}
                    /> */}
                    <FormField
                    control={form.control}
                    name="category" 
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-5 items-center gap-4">
                        <FormLabel className=" col-span-1 font-medium">Category</FormLabel>
                        <div className="col-span-3">
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
                        <div className="col-span-3">
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
                        </div>
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
            </CardContent>
            <div className="flex items-center justify-between px-4 pt-4 border-t">
            <div>
                <Link href="/asset/list_asset">
                <Button variant="outline" className="flex items-center gap-2" type="button"><ChevronLeft size={16}/> List Asset </Button>
                </Link>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()} > <X size={16}/>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submiting..." : <><Plus size={16}/>Add Asset </>}
                </Button>
            </div>
            </div>
            </form>
        </Form>
        </Card>
    )
}