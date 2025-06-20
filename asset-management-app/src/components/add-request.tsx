"use client";

import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarIcon, ChevronLeft, Plus, X } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { useUser } from "@/hooks/use-user";

function formatDate(date: Date | undefined): string {
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("en-CA");
}

function isValidDate(date: Date | undefined): boolean {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

const FormSchema = z.object({
  asset_id: z.string().min(1, "Asset ID is required"),
  request_date: z.date({
    required_error: "A Request Date is required",
  }),
});

interface AddRequestViewProps {
  token: string | undefined;
}

export function AddRequestView({ token }: AddRequestViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useUser();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      asset_id: "",
      request_date: new Date(),
    },
  });

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(form.getValues("request_date"));

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
      asset_id: data.asset_id,
      request_date: formatDate(data.request_date),
      created_by: user.name,
      updated_by: user.name,
    };

    try {
      const response = await fetch('http://localhost:3000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to add request");
      }

      toast.success("Request added successfully!", {
        description: `Request for Asset ID ${payload.asset_id} has been saved.`,
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
    <Card className="mx-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl md:text-3xl">Add Request</CardTitle>
                <CardDescription className="mt-2 text-sm">
                  Fill out the form below to create a new asset request.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="asset_id"
              render={({ field }) => (    
                <FormItem className="grid grid-cols-5 items-center gap-4">
                  <FormLabel className="col-span-1 font-medium">Asset ID</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input placeholder="e.g., A06253" {...field} />
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
                                field.onChange(date);
                              } else {
                                field.onChange(undefined);
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
                                field.onChange(date);
                                setOpen(false);
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
              <Link href="/request/list-request">
                <Button variant="outline" className="flex items-center gap-2" type="button"><ChevronLeft size={16} /> List Request </Button>
              </Link>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2" type="button" onClick={() => form.reset()} > <X size={16} />Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : <><Plus size={16} />Add Request</>}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </Card>
  )
}