"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TicketSchema = z.object({
  name: z.string().min(1, "Name is required"),

  email: z.string().min(1, "Email is required").email("Invalid email address"),

  phone: z
    .string()
    .regex(
      /^01[0-9]{9}$/,
      "Phone must be a valid Bangladeshi number (11 digits)"
    ),

  message: z.string().min(3, "Message is required"),
});

export default function CreateTicketPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof TicketSchema>) => {
    try {
      setLoading(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user: any = await fetcher("/user-profile");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res: any = await fetcher("/ticket-store", {
        method: "POST",
        body: JSON.stringify({
          customer_id: user?.data?.id,
          name: values.name,
          email: values.email,
          phone: values.phone,
          message: values.message,
        }),
      });

      if (res?.status === true) {
        console.log(res);
        router.refresh();
        router.push("/account/tickets");
        toast.success("Ticket created successfully!");
        form.reset();
      } else {
        toast.error("Failed to create ticket. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to create ticket. Please try again.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white rounded-sm p-4 md:p-8 font-sans">
      <div className="space-y-6">
        <Link
          href="/account/tickets"
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tickets
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Create New Ticket
          </h1>
          <p className="text-slate-500">Submit a new support request.</p>
        </div>

        <Card className="rounded-xl border-none shadow-sm bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/30">
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>Fill out all required fields.</CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Boss"
                            {...field}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="boss@email.com"
                            {...field}
                            className="rounded-xl"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="017XXXXXXXX"
                            {...field}
                            className="rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your issue here..."
                            className="rounded-xl min-h-[140px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>

              <CardFooter className="p-6 border-t bg-slate-50/30 flex justify-end">
                <Button type="submit" disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
