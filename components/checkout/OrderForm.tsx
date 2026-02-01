"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BANGLADESH_DISTRICTS } from "@/lib/constants/districts";

export default function OrderForm({
  formData,
  setFormData,
}: {
  formData: {
    name: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    customer_id: number;
    payment_method: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: any;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            id="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="phone">
            Phone <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            value={formData?.phone}
            placeholder="Enter phone number"
            required
            type="tel"
            pattern="[0-9]{11}"
            maxLength={11}
          />
        </div>

        {/* District */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="district">
            District <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData?.district || ""}
            onValueChange={(value) =>
              setFormData({ ...formData, district: value })
            }
            required
          >
            <SelectTrigger className="w-full" id="district" aria-required="true">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {BANGLADESH_DISTRICTS.map((district) => (
                <SelectItem key={district} value={district}>
                  {district}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="flex flex-col space-y-1">
          <Label htmlFor="city">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            value={formData?.city || ""}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            id="city"
            placeholder="Enter city name"
            required
          />
        </div>

        {/* Address */}
        <div className="flex flex-col col-span-1 md:col-span-2 space-y-1 w-full">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={formData?.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            id="address"
            placeholder="Enter full address"
            required
          />
        </div>
      </form>
    </div>
  );
}
