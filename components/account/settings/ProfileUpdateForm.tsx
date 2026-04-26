'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  submitUserSettingsForm,
  submitUserSettingsWithFields,
} from '@/lib/fetcher';
import { toast } from 'sonner';
import { BANGLADESH_DISTRICTS } from '@/lib/constants/districts';
import {
  isImageFileSizeValid,
  getImageFileTooLargeMessage,
} from '@/lib/fileUpload';
import { User, Upload, Eye } from 'lucide-react';

/** Same as checkout/cart: above BottomNav on small screens. */
const MOBILE_CTA_BAR_PIN =
  'fixed inset-x-0 z-60 px-2 pt-1 max-md:bottom-[calc(4rem+env(safe-area-inset-bottom,0px))] md:bottom-0 md:pb-[max(0.5rem,env(safe-area-inset-bottom,0px))]';

function firstValidationError(errors: unknown): string | undefined {
  if (!errors || typeof errors !== 'object') return undefined;
  for (const v of Object.values(errors as Record<string, unknown>)) {
    if (Array.isArray(v) && typeof v[0] === 'string') return v[0];
    if (typeof v === 'string') return v;
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function profileRecord(user: any): Record<string, unknown> {
  return (user?.data ?? user ?? {}) as Record<string, unknown>;
}

function existingProfileImagePath(user: unknown): string {
  const image = profileRecord(user).image;
  return typeof image === 'string' && image.trim() ? image.trim() : '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileUpdateForm({ user }: { user: any }) {
  const pr = profileRecord(user);
  const [name, setName] = useState(String(pr.name ?? ''));
  const [email, setEmail] = useState(String(pr.email ?? ''));
  const [emergencyNumber, setEmergencyNumber] = useState(
    String(pr.emergency_number ?? pr.phone ?? ''),
  );
  const [district, setDistrict] = useState(String(pr.district ?? ''));
  const [city, setCity] = useState(String(pr.city ?? ''));
  const [address, setAddress] = useState(String(pr.address ?? ''));

  const [errors, setErrors] = useState<Record<string, string>>({
    name: '',
    district: '',
    city: '',
    address: '',
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!district.trim()) newErrors.district = 'District is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildSettingsFormData = (file?: File) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', emergencyNumber);
    formData.append('emergency_number', emergencyNumber);
    formData.append('district', district);
    formData.append('city', city);
    formData.append('address', address);
    if (file) {
      formData.append('image', file);
    }
    return formData;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const savedImage = existingProfileImagePath(user);

    // Multipart like new upload: existing file is re-fetched on server and sent as `image` Blob + filename.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await submitUserSettingsWithFields({
      name,
      email,
      phone: emergencyNumber,
      emergency_number: emergencyNumber,
      district,
      city,
      address,
      ...(savedImage ? { existingImageRelativePath: savedImage } : {}),
    });

    if (res?.status) {
      toast.success(res?.message ?? 'Profile updated');
      router.refresh();
    } else {
      toast.error(
        res?.message ||
          firstValidationError(res?.errors) ||
          'Failed to update profile',
      );
    }
  };

  const savedImagePath = existingProfileImagePath(user);
  const profileImageUrl = savedImagePath
    ? `${process.env.NEXT_PUBLIC_IMG_URL || ''}/${savedImagePath}`
    : null;
  const displayImageUrl = previewUrl ?? profileImageUrl;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }
    if (!isImageFileSizeValid(file)) {
      toast.error(getImageFileTooLargeMessage());
      e.target.value = '';
      return;
    }
    if (!validate()) {
      toast.error(
        'Please fill required fields (name, district, city, address) before uploading a photo',
      );
      e.target.value = '';
      return;
    }
    if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsUploading(true);
    e.target.value = '';
    try {
      const res = await submitUserSettingsForm(buildSettingsFormData(file));
      const ok =
        res?.status === true ||
        res?.status === 'success' ||
        String(res?.status || '').toLowerCase() === 'success';
      if (ok) {
        toast.success(res?.message ?? 'Photo updated');
        setPreviewUrl(null);
        setTimeout(() => URL.revokeObjectURL(url), 0);
        router.refresh();
      } else {
        const msg =
          (typeof res?.message === 'string' && res.message) ||
          firstValidationError(res?.errors) ||
          'Failed to upload photo';
        toast.error(msg);
      }
    } catch {
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Profile picture + image preview + actions */}
      <div className="flex flex-col items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-label="Upload profile photo"
          onChange={handlePhotoChange}
          disabled={isUploading}
        />
        <div className="relative group">
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:ring-offset-2"
              >
                <Avatar className="size-28 rounded-full bg-[#2563eb] border-4 border-white shadow-md">
                  {displayImageUrl ? (
                    <AvatarImage
                      src={displayImageUrl}
                      alt={name}
                      className="object-cover"
                    />
                  ) : null}
                  <AvatarFallback className="rounded-full bg-[#2563eb] text-gray-300">
                    <User className="size-14" />
                  </AvatarFallback>
                </Avatar>
                {displayImageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Eye className="size-8 text-white" />
                    <span className="sr-only">Preview photo</span>
                  </div>
                )}
              </button>
            </DialogTrigger>
            <DialogContent className="aspect-square max-w-md p-0 overflow-hidden">
              <DialogTitle className="sr-only">
                Profile photo preview
              </DialogTitle>
              <DialogDescription className="sr-only">
                Preview of your profile photo
              </DialogDescription>
              <div className="relative w-full h-full min-h-70">
                {displayImageUrl ? (
                  <Image
                    src={displayImageUrl}
                    alt={name || 'Profile'}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 448px) 100vw, 448px"
                    unoptimized={displayImageUrl.startsWith('blob:')}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#2563eb] rounded-lg">
                    <User className="size-24 text-gray-300" />
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="rounded-md border-gray-300 bg-white text-black hover:bg-gray-50"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <Upload className="size-4" />
            {isUploading ? 'Uploading…' : 'Change Photo'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-md bg-red-600 hover:bg-red-700"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Form: District & City same width, Address full width */}
      <form
        id="profile-update-form"
        onSubmit={handleUpdate}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              <span className="text-red-500">*</span> Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-md border-gray-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          {/* Emergency Number */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-md border-gray-300"
            />
          </div>

          {/* Emergency Number */}
          <div className="space-y-2">
            <Label htmlFor="emergency">Emergency Number</Label>
            <Input
              id="emergency"
              placeholder="e.g. 017xxxxxxxx"
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
              className="rounded-md border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* District - same width as City */}
          <div className="space-y-2">
            <Label htmlFor="district">
              <span className="text-red-500">*</span> District
            </Label>
            <Select value={district || ''} onValueChange={setDistrict}>
              <SelectTrigger
                id="district"
                className="rounded-md border-gray-300 w-full"
              >
                <SelectValue placeholder="Select district" />
              </SelectTrigger>
              <SelectContent>
                {BANGLADESH_DISTRICTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.district && (
              <p className="text-red-500 text-sm">{errors.district}</p>
            )}
          </div>

          {/* City - same width as District */}
          <div className="space-y-2">
            <Label htmlFor="city">
              <span className="text-red-500">*</span> City
            </Label>
            <Input
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-md border-gray-300 w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Address - full width */}
        <div className="space-y-2 w-full">
          <Label htmlFor="address">
            <span className="text-red-500">*</span> Address
          </Label>
          <Textarea
            id="address"
            placeholder="Enter full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-25 w-full resize-y rounded-md border-gray-300"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address}</p>
          )}
        </div>

        <div className="hidden lg:block">
          <Button
            type="submit"
            className="w-full rounded-md py-3 text-base font-medium text-white"
          >
            Update
          </Button>
        </div>
      </form>

      {/* Mobile: fixed Update bar */}
      <div className={`pointer-events-none lg:hidden ${MOBILE_CTA_BAR_PIN}`}>
        <div className="pointer-events-auto mx-auto max-w-3xl rounded-xl border border-gray-200/90 bg-white/95 p-2 shadow-lg shadow-black/10 backdrop-blur-md supports-backdrop-filter:bg-white/90">
          <Button
            type="submit"
            form="profile-update-form"
            className="h-10 w-full bg-primary text-sm font-semibold shadow-sm hover:bg-primary/90"
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
}
