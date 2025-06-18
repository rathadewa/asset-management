"use client"

import { AppSidebar } from "@/components/app-sidebar"
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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Plus, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_CONFIG from "@/config/api";

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

export default function Page() {
  const [isSubmiting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      asset_name: "",
      asset_id: "A001",
      category: "",
      status: "Ready to Deploy",
      location: "",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    const payload = {
      ...data,
      created_by: "firmanakbarm", 
      updated_by: "firmanakbarm", 
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        
        throw new Error(result.message || "Failed to add asset");
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
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
                              <CardHeader>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-2xl md:text-3xl">Add Asset</CardTitle>
                                    <CardDescription className="mt-2 text-sm">
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
                                  <FormField
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
                                  />
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
                                <Button type="submit" disabled={isSubmiting}>
                                  {isSubmiting ? "Submiting..." : <><Plus size={16}/>Add Asset </>}
                                </Button>
                            </div>
                          </div>
                          </form>
                        </Form>
                      </Card>
                    </div>
                </div>
            </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}