import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { waitlistFormSchema } from "@shared/schema";
import type { InsertWaitlist } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WaitlistForm() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      role: "",
      consentToMarketing: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      const res = await apiRequest("POST", "/api/waitlist", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
        variant: "default",
      });
      setSubmitted(true);
      form.reset();
    },
    onError: (error: any) => {
      let errorMessage = "Something went wrong. Please try again.";
      if (error.message && error.message.includes("409")) {
        errorMessage = "This email is already on our waitlist.";
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: InsertWaitlist) {
    mutation.mutate(data);
  }

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900">Thanks for signing up!</h3>
        <p className="text-gray-600 mb-4">We'll notify you when Quantum is ready.</p>
        <Button 
          variant="outline" 
          onClick={() => setSubmitted(false)}
          className="text-primary hover:text-primary hover:bg-blue-50"
        >
          Sign up another email
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                  type="email" 
                  placeholder="john@example.com" 
                  {...field} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Role</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="founder">Founder/CEO</SelectItem>
                  <SelectItem value="executive">Executive/Manager</SelectItem>
                  <SelectItem value="product">Product Manager</SelectItem>
                  <SelectItem value="engineering">Engineer/Developer</SelectItem>
                  <SelectItem value="design">Designer</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="consentToMarketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-1"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-gray-700">
                  I agree to receive product updates and marketing communications from Quantum.
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={mutation.isPending}
          className="w-full flex items-center justify-center px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors font-medium"
        >
          {mutation.isPending ? "Joining..." : "Join the Waitlist"}
        </Button>
      </form>
    </Form>
  );
}
