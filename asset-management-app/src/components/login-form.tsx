"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import API_CONFIG from "@/config/api"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"


const FormSchema = z.object({
  user_id: z.string().min(1, { message: "Username is required." }),
  user_password: z.string().min(1, { message: "Password is required." }),
})

export function LoginForm({className, ...props}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
        user_id: "",
        user_password: "",
    },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        console.log("Attempting to log in with:", data); 
       
        try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.login}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        console.log("Response status:", response.status); 

        const result = await response.json();
        console.log("Response body:", result); 

        if (!response.ok) {
            
            const errorMessage = result.message || result.error || "Login failed. Please check your credentials.";
            throw new Error(errorMessage);
        }

        const userToStore = { name: data.user_id };
        localStorage.setItem('user', JSON.stringify(userToStore));
        Cookies.set("token", result.token, { expires: 1, sameSite: 'strict' })
        toast.success("Login Successful!", {
            description: "You will be redirected to the dashboard.",
        });
        router.refresh();

        } catch (error) {
        
        console.error("Caught an error:", error); 

        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
        toast.error("Login Failed", { description: errorMessage });
        } finally {
        setIsLoading(false);
        }
    }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center text-center mb-6">
                        <h1 className="text-2xl font-bold">Welcome</h1>
                        <p className="text-muted-foreground text-balance">
                        Login to your Asset Management account
                        </p>
                    </div>
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="user_id"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>User ID</FormLabel>
                                <FormControl>
                                <Input placeholder="Input your user id" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <div className="grid gap-3">
                        <FormField
                            control={form.control}
                            name="user_password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                    <div className="text-center text-sm mt-6">
                        Don&apos;t have an account?{" "}
                        <a href="#" className="underline underline-offset-4">
                            Sign up
                        </a>
                    </div>
                </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            {/* <img
              src="/file.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            /> */}
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Development by ...
      </div>
    </div>
  )
}