"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetcher } from "@/lib/fetcher";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileUpdateForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.data?.name || "");
  const [number, setNumber] = useState(user?.data?.phone || "");
  const [email, setEmail] = useState(user?.data?.email || "");
  const [address, setAddress] = useState(user?.data?.address || "");

  const [errors, setErrors] = useState({
    name: "",
    number: "",
    email: "",
    address: "",
  });

  const validate = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};

    if (!name.trim()) newErrors.name = "Name is required";

    if (!number.trim()) newErrors.number = "Phone number is required";
    else if (!/^01\d{9}$/.test(number))
      newErrors.number = "Invalid phone number";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!email.includes("@")) newErrors.email = "Invalid email";

    if (!address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateProfileData: any = await fetcher("/user-settings", {
      method: "POST",
      body: JSON.stringify({
        name,
        phone: number,
        email,
        address,
      }),
    });

    if (updateProfileData?.status) {
      toast.success(updateProfileData?.message);
    } else {
      toast.error(updateProfileData?.message || "Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="font-medium">Name *</label>
          <Input
            placeholder="Enter your name"
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="font-medium">Number *</label>
          <Input
            placeholder="e.g. 017xxxxxxxx"
            className="mt-1"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />
          {errors.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="font-medium">Email *</label>
          <Input
            placeholder="Enter your email"
            className="mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label className="font-medium">Address *</label>
        <Textarea
          placeholder="Enter full address"
          className="mt-1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      <Button type="submit" className="w-full py-3 rounded-lg text-lg">
        Update
      </Button>
    </form>
  );
}
