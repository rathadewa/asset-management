"use client"

// import { AppSidebar } from "@/components/app-sidebar"
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
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { toast } from "sonner"
// import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";

// const categories = ["Laptop", "Hp", "Monitor", "Pointer"];
// const statuses = ["Ready to Deploy", "Deployed", "Undeployed"];

// const FormSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   asset_id: z.string(),
//   category: z.enum(categories, { 
//     required_error: "Please select an asset category.",
//   }),
//   status: z.enum(statuses),
//   location: z.string().min(4, {
//     message: "Location must be at least 4 characters.",
//   }),
// })

// export default function Page() {
//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       name: "",
//       asset_id: "A001",
//       category: undefined,
//       status: "Ready to Deploy",
//       location: "",
//     },
//   })

//   function onSubmit(data: z.infer<typeof FormSchema>) {
//     toast("You submitted the following values", {
//       description: (
//         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
//           <code className="text-white">{JSON.stringify(data, null, 2)}</code>
//         </pre>
//       ),
//     })
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mr-2 data-[orientation=vertical]:h-4"
//             />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="#">
//                     Asset
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Add Asset</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//             <div className="flex flex-1 flex-col">
//                 <div className="@container/main flex flex-1 flex-col gap-2">
//                     <div className="flex flex-col gap-4 py-4 md:py-6">
//                       <Card className="mx-4">
//                           <Form {...form}>
//                               <CardHeader>
//                                 <div className="flex justify-between items-start">
//                                   <div>
//                                     <CardTitle className="text-2xl md:text-3xl">Add Asset</CardTitle>
//                                     <CardDescription className="mt-2 text-sm">
//                                       {/* Asset ID: <Badge variant="outline" className="text-sm">{asset.asset_id}</Badge> */}
//                                     </CardDescription>
//                                   </div>
//                                 </div>
//                               </CardHeader>
//                               <CardContent>
//                                 <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
//                                   <FormField
//                                     control={form.control}
//                                     name="name"
//                                     render={({ field }) => (
//                                       <FormItem className="grid grid-cols-5 items-center gap-4">
//                                         <FormLabel className="col-span-1 font-medium">Asset Name</FormLabel>
//                                         <div className="col-span-3">
//                                           <FormControl>
//                                             <Input placeholder="Input Asset Name.." {...field} />
//                                           </FormControl>
//                                           <FormMessage />
//                                         </div>
//                                       </FormItem>
//                                     )}
//                                   />
//                                   <FormField
//                                     control={form.control}
//                                     name="asset_id"
//                                     render={({ field }) => (
//                                       <FormItem className="grid grid-cols-5 items-center gap-4">
//                                         <FormLabel className="col-span-1 font-medium">Asset ID</FormLabel>
//                                         <div className="col-span-3">
//                                           <FormControl>
//                                             <Input {...field} />
//                                           </FormControl>
//                                           <FormMessage />
//                                         </div>
//                                       </FormItem>
//                                     )}
//                                   />
//                                   <FormField
//                                     control={form.control}
//                                     name="category" 
//                                     render={({ field }) => (
//                                       <FormItem className="grid grid-cols-5 items-center gap-4">
//                                         <FormLabel className=" col-span-1 font-medium">Category</FormLabel>
//                                         <Select onValueChange={field.onChange} value={field.value}>
//                                           <FormControl>
//                                             <SelectTrigger>
//                                               <SelectValue placeholder="Select a category" />
//                                             </SelectTrigger>
//                                           </FormControl>
//                                           <SelectContent>
//                                             {categories.map((category) => (
//                                               <SelectItem key={category} value={category}>
//                                                 {category}
//                                               </SelectItem>
//                                             ))}
//                                           </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                       </FormItem>
//                                     )}
//                                   />
//                                   <FormField
//                                     control={form.control}
//                                     name="status" 
//                                     render={({ field }) => (
//                                       <FormItem className="grid grid-cols-5 items-center gap-4">
//                                         <FormLabel className="col-span-1 font-medium">Status</FormLabel>
//                                         <Select onValueChange={field.onChange} value={field.value}>
//                                           <FormControl>
//                                             <SelectTrigger>
//                                               <SelectValue placeholder="Select a Status" />
//                                             </SelectTrigger>
//                                           </FormControl>
//                                           <SelectContent>
//                                             {statuses.map((status) => (
//                                               <SelectItem key={status} value={status}>
//                                                 {status}
//                                               </SelectItem>
//                                             ))}
//                                           </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                       </FormItem>
//                                     )}
//                                   />
//                                   <FormField
//                                     control={form.control}
//                                     name="location"
//                                     render={({ field }) => (
//                                       <FormItem className="grid grid-cols-5 items-center gap-4">
//                                         <FormLabel className="col-span-1 font-medium">Location</FormLabel>
//                                         <div className="col-span-3">
//                                           <FormControl>
//                                             <Input placeholder="Input Asset Location.." {...field} />
//                                           </FormControl>
//                                           <FormMessage />
//                                         </div>
//                                       </FormItem>
//                                     )}
//                                   />
//                                 </form>
//                             </CardContent>
//                             <div className="flex items-center justify-between px-4 pt-4 border-t">
//                             <div>
//                               <Link href="/asset/list_asset">
//                                 <Button variant="outline" className="flex items-center gap-2" type="button"><ChevronLeft size={16}/> List Asset </Button>
//                               </Link>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()} > <X size={16}/>Cancel</Button>
//                                 <Button className="submit"><Plus size={16}/>Update</Button>
//                             </div>
//                           </div>
//                         </Form>
//                       </Card>
//                     </div>
//                 </div>
//             </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

import { AppSidebar } from "@/components/app-sidebar";
// ... import lainnya
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useRouter } from "next/navigation";
import API_CONFIG from "@/config/api"; // <-- Pastikan path ini benar

const categories = ["Laptop", "Hp", "Monitor", "Pointer"];
const statuses = ["Ready to Deploy", "Deployed", "Undeployed"];

const FormSchema = z.object({
  name: z.string().min(2, {
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

// --- FUNGSI addAsset DITEMPATKAN DI SINI ---
// Berada di luar komponen 'Page', tetapi di dalam file yang sama.
async function addAsset(data: z.infer<typeof FormSchema>) {
  const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.assets}`;

  const payload = {
    asset_id: data.asset_id,
    asset_name: data.name,
    category: data.category,
    status: data.status,
    location: data.location,
    created_by: "admin",
    updated_by: "admin",
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add new asset.');
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding asset:", error);
    throw error;
  }
}

// Komponen Halaman Anda
export default function Page() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({resolver: zodResolver(FormSchema),
  defaultValues: {
    name: "",
    asset_id: "", // Sebaiknya dikosongkan juga
    category: "", // <-- UBAH DARI undefined MENJADI STRING KOSONG
    status: "Ready to Deploy",
    location: "",
  },
})

  // Fungsi onSubmit sekarang bisa langsung memanggil addAsset dari atas
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const promise = addAsset(data);

    toast.promise(promise, {
      loading: "Adding new asset...",
      success: (response) => {
        router.push('/asset/list_asset');
        return `Asset "${data.name}" has been successfully added.`;
      },
      error: (err) => {
        return err.message || "Failed to add asset.";
      },
    });
  }

  return (
    // ... sisa JSX Anda (tidak ada yang berubah di sini) ...
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
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-2xl md:text-3xl">Add Asset</CardTitle>
                          <CardDescription className="mt-2 text-sm">
                            {/* Asset ID: <Badge variant="outline" className="text-sm">{asset.asset_id}</Badge> */}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                        <CardContent>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
                            <FormField
                              control={form.control}
                              name="name"
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
                          <Button className="submit"><Plus size={16}/>Update</Button>
                      </div>
                    </div>
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