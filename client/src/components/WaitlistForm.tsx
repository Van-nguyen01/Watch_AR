import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { waitlistFormSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;

export function WaitlistForm() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      terms: false,
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const res = await apiRequest("POST", "/api/waitlist", data);
      return res.json();
    },
    onSuccess: (data) => {
      setIsSuccess(true);
      toast({
        title: "Success!",
        description: "You've been added to our waitlist!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: WaitlistFormValues) {
    mutate(data);
  }

  if (isSuccess) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">You're on the list!</h3>
        <p className="text-gray-600">Thanks for joining our waitlist. We'll be in touch soon with more information.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="john@example.com" 
                  type="email" 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Company (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Acme Inc." 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-gray-600 text-sm font-normal">
                  I agree to the <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a> and <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full px-4 py-3 bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white font-medium rounded-md shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isPending}
        >
          {isPending ? 'Joining...' : 'Join Waitlist'}
        </Button>
      </form>
    </Form>
  );
}
