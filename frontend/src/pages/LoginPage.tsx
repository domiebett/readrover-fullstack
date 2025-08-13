import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "../features/auth/api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, BookOpen, Mail, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

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
      nav(p.get("from") || "/home", { replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-5 bg-[url('/placeholder-fzipf.png')] bg-repeat"></div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-yellow-800">BookNook</h1>
          </Link>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-yellow-200 shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle role="heading" aria-level={1} className="font-serif text-2xl font-bold text-yellow-800">Welcome Back</CardTitle>
            <p className="text-gray-600">Continue your reading journey</p>
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
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          type="email" 
                          aria-invalid={!!formState.errors.email}
                          aria-describedby={
                            formState.errors.email ? `${field.name}-error` : undefined
                          }
                          className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
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
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your password" 
                          type="password"
                          aria-invalid={!!formState.errors.password}
                          aria-describedby={
                            formState.errors.password ? `${field.name}-error` : undefined
                          }
                          className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
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
                  className="w-full bg-yellow-700 hover:bg-yellow-800 text-white shadow-lg py-3 text-lg font-medium" 
                  disabled={mut.isPending}
                >
                  {mut.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-pink-600 hover:text-pink-700 font-medium hover:underline transition-colors"
                  >
                    Register
                  </Link>
                </p>
              </div>

              <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-700 text-center italic">
                  "A reader lives a thousand lives before he dies." - George R.R. Martin
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
