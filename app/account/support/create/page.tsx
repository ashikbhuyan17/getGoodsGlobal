"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { ChevronLeft, Send, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import { Card, CardContent } from "@/components/ui/card";

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetcher, createTicket } from "@/lib/fetcher";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const TICKET_TYPES = [
  "Refund Support",
  "Order section Problem",
  "Delivery Issue",
  "Product Quality",
  "Payment Issue",
  "General Support",
] as const;

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
  type: z.string().min(1, "Type is required"),
});

export default function CreateTicketPage() {
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const form = useForm({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      type: "General Support",
    },
  });

  const onSubmit = async (values: z.infer<typeof TicketSchema>) => {
    try {
      setLoading(true);

      const user = await fetcher<{ data?: { id?: string } }>("/user-profile");
      const customerId = String(user?.data?.id ?? "");

      const res = await createTicket({
        customer_id: customerId,
        name: values.name,
        email: values.email,
        phone: values.phone,
        message: values.message,
        type: values.type,
        ...(uploadedImage && { image: uploadedImage }),
      });

      if (res?.status === true) {
        toast.success("Ticket created successfully!");
        window.location.href = "/account/support";
      } else {
        toast.error(res?.message || "Failed to create ticket. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to create ticket. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4 px-2 pb-20">
      {/* Header - matches support list page */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-sm">
        <div className="px-4 py-4 flex items-center gap-4">
          <Link
            href="/account/support"
            aria-label="Back to support"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Create New Ticket
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Submit a support request and we&apos;ll get back to you soon
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your name"
                          {...field}
                          className="rounded-lg border-gray-300 focus-visible:ring-teal-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your@email.com"
                          {...field}
                          type="email"
                          className="rounded-lg border-gray-300 focus-visible:ring-teal-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="017XXXXXXXX"
                          {...field}
                          className="rounded-lg border-gray-300 focus-visible:ring-teal-500"
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-lg border-gray-300 focus:ring-teal-500">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TICKET_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block text-gray-700">
                  Attach Image (Optional)
                </Label>
                {uploadedImage ? (
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={uploadedImage}
                        alt="Attached image"
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedFile(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-teal-600 transition-colors min-h-37.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Upload Image / Screenshot
                    </span>
                  </label>
                )}
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your issue in detail. Include order ID if applicable..."
                        className="rounded-lg min-h-[120px] resize-none border-gray-300 focus-visible:ring-teal-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </CardContent>

            <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-6"
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
