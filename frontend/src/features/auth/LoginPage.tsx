import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "./api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form/form";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const nav = useNavigate();
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mut = useMutation({
    mutationFn: login,
    onSuccess: () => {
      const p = new URLSearchParams(window.location.search);
      nav(p.get("from") || "/", { replace: true });
    },
  });

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle role="heading" aria-level={1}>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit((data) => mut.mutate(data))} 
              className="space-y-4"
              noValidate
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        type="email" 
                        aria-invalid={!!formState.errors.email}
                        aria-describedby={
                          formState.errors.email ? `${field.name}-error` : undefined
                        }
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} data-testid="email-error" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, formState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your password" 
                        type="password"
                        aria-invalid={!!formState.errors.password}
                        aria-describedby={
                          formState.errors.password ? `${field.name}-error` : undefined
                        }
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage id={`${field.name}-error`} data-testid="password-error" />
                  </FormItem>
                )}
              />
              {mut.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {mut.error instanceof Error ? mut.error.message : "Login failed"}
                  </AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={mut.isPending}
              >
                {mut.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-primary hover:underline"
            >
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
