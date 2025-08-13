import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register as registerApi } from "../features/auth/api";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, BookOpen, User, Mail, Lock } from "lucide-react";
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
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const nav = useNavigate();
  const qc = useQueryClient();
  
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const mut = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      nav("/", { replace: true });
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
            <CardTitle role="heading" aria-level={1} className="font-serif text-2xl font-bold text-yellow-800">Join BookNook</CardTitle>
            <p className="text-gray-600">Start your reading adventure today</p>
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
                  name="username"
                  render={({ field, formState }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Username
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Choose a username"
                          aria-invalid={!!formState.errors.username}
                          aria-describedby={
                            formState.errors.username ? `${field.name}-error` : undefined
                          }
                          className="border-yellow-200 focus:border-yellow-400 focus:ring-yellow-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage id={`${field.name}-error`} data-testid="username-error" />
                    </FormItem>
                  )}
                />
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
                          placeholder="Create a secure password" 
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
                      {mut.error instanceof Error ? mut.error.message : "Registration failed"}
                    </AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg py-3 text-lg font-medium" 
                  disabled={mut.isPending}
                >
                  {mut.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </form>
            </Form>

            <div className="mt-6">
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-yellow-700 hover:text-yellow-800 font-medium hover:underline transition-colors"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              <div className="mt-6 bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-lg border border-pink-200">
                <p className="text-sm text-gray-700 text-center italic">
                  "The more that you read, the more things you will know." - Dr. Seuss
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
