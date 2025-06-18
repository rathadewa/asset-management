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
import { CalendarIcon, ChevronLeft, Plus, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react";
import { useRouter } from "next/navigation";
import API_CONFIG from "@/config/api";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function formatDate(date: Date | undefined) {
  if (!date) {
    return ""
  }
  // Menggunakan format en-CA (YYYY-MM-DD) agar lebih mudah di-parse kembali
  // dan lebih universal
  return date.toLocaleDateString("en-CA"); 
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }
  return !isNaN(date.getTime())
}

const FormSchema = z.object({
  request_id: z.string(),
  assets_id: z.string(),
  request_date: z.date({
    required_error: "A Request Date is required",
  }),
})

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      request_id: "",
      assets_id: "A001",
      request_date: new Date(),
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);

    const payload = {
      request_id: data.request_id,
      assets_id: data.assets_id,
      request_date: formatDate(data.request_date),
      created_by: "firmanakbarm", 
      updated_by: "firmanakbarm", 
    };

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.request}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        
        throw new Error(result.message || "Failed to add request");
      }
      toast.success("Asset added successfully!", {
        description: `Request ID ${payload.request_id} has been saved.`,
      });
      router.push('/request/list_request');
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
                    Request
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Request</BreadcrumbPage>
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
                                    <CardTitle className="text-2xl md:text-3xl">Add Request</CardTitle>
                                    <CardDescription className="mt-2 text-sm">
                                    </CardDescription>
                                  </div>
                                </div>
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
                                            <Input placeholder="Input Request ID.." {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </div>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={form.control}
                                    name="assets_id"
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
                                    name="request_date"
                                    render={({ field }) => {
                                        const [open, setOpen] = useState(false);
                                        const [month, setMonth] = useState<Date | undefined>(field.value);

                                        return (
                                        <FormItem className="grid grid-cols-5 items-center gap-4">
                                            <FormLabel className="col-span-1 font-medium">Request Date</FormLabel>
                                            <div className="col-span-3">
                                            <div className="relative flex gap-2">
                                                <FormControl>
                                                <Input
                                                    id="date"
                                                    placeholder="YYYY-MM-DD"
                                                    className="bg-background pr-10"
                                                    value={field.value ? formatDate(field.value) : ""}
                                                    onChange={(e) => {
                                                    const date = new Date(e.target.value);
                                                    if (isValidDate(date)) {
                                                        field.onChange(date); // Update state form
                                                    } else {
                                                        field.onChange(undefined); // Kosongkan jika tidak valid
                                                    }
                                                    }}
                                                />
                                                </FormControl>
                                                <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                    id="date-picker"
                                                    variant="ghost"
                                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                                    >
                                                    <CalendarIcon className="size-3.5" />
                                                    <span className="sr-only">Select date</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto overflow-hidden p-0" align="end">
                                                    <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(date) => {
                                                        field.onChange(date); // Update state form
                                                        setOpen(false); // Tutup popover
                                                    }}
                                                    month={month}
                                                    onMonthChange={setMonth}
                                                    captionLayout="dropdown"
                                                    fromYear={2020}
                                                    toYear={2030}
                                                    initialFocus
                                                    />
                                                </PopoverContent>
                                                </Popover>
                                            </div>
                                            <FormMessage />
                                            </div>
                                        </FormItem>
                                        );
                                    }}
                                    />
                            </CardContent>
                            <div className="flex items-center justify-between px-4 pt-4 border-t">
                            <div>
                              <Link href="/request/list_request">
                                <Button variant="outline" className="flex items-center gap-2" type="button"><ChevronLeft size={16}/> List Request </Button>
                              </Link>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()} > <X size={16}/>Cancel</Button>
                                <Button type="submit" disabled={isSubmitting}>
                                  {isSubmitting ? "Submiting..." : <><Plus size={16}/>Add Request </>}
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