'use server';

import { cookies } from 'next/headers';
import { deleteToken } from '@/action/token';

async function readAuthToken(): Promise<string | undefined> {
  try {
    const cookiesStore = await cookies();
    return cookiesStore.get('token')?.value;
  } catch {
    return undefined;
  }
}

// export async function fetcher<T>(
//   slug: string,
//   options: RequestInit = {},
//   revalidate: number | false = 0,
// ): Promise<T> {
//   try {
//     const cookiesStore = await cookies();
//     const token = await cookiesStore.get('token')?.value;
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
//       ...options,
//       next: revalidate ? { revalidate } : undefined,
//       headers: {
//         ...(token && { Authorization: `Bearer ${token}` }),
//         'Content-Type': 'application/json',
//       },
//     });

//     return res.json() as Promise<T>;
//   } catch (error) {
//     console.log('Fetcher Error:', error);
//     throw error;
//   }
// }

export async function fetcher<T>(
  slug: string,
  options: RequestInit = {},
  revalidate: number | false = 0,
  auth = true, // NEW: whether to use cookies & token
): Promise<T> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };
    if (auth) {
      const token = await readAuthToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }

    const noStore = options.cache === 'no-store';

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      headers,
      ...(noStore
        ? { cache: 'no-store' as const }
        : revalidate
          ? { next: { revalidate } }
          : {}),
    });

    return res.json() as Promise<T>;
  } catch (error) {
    console.log('Fetcher Error:', error);
    throw error;
  }
}

/** Fetch flash sale page (for Load More) */
export async function fetchFlashSalePage(
  page: number,
): Promise<{ data?: unknown[]; last_page?: number; current_page?: number }> {
  try {
    const result = await fetcher<{
      data?: { data?: unknown[]; last_page?: number; current_page?: number };
    }>(`/flash-sale?page=${page}`);
    return result?.data ?? { data: [], last_page: 1, current_page: 1 };
  } catch {
    return { data: [], last_page: 1, current_page: 1 };
  }
}

/** GET cart-order-products with selected cart IDs. Used before redirecting to checkout. */
export async function cartOrderProducts(
  cartIds: string[],
): Promise<{ status?: boolean | string; message?: string; data?: unknown }> {
  if (!cartIds?.length) {
    return { status: false, message: 'No cart items selected' };
  }
  try {
    const query = cartIds
      .map((id) => `cart_ids[]=${encodeURIComponent(id)}`)
      .join('&');
    const slug = `/cart-order-products?${query}`;
    const result = await fetcher<{
      status?: boolean | string;
      message?: string;
      data?: unknown;
    }>(slug);
    return result;
  } catch (error) {
    console.log('Cart order products error:', error);
    return { status: false, message: 'Failed to prepare cart for checkout' };
  }
}

/** Create ticket (JSON). Sends customer_id, name, email, phone, message, type, image (optional base64) */
export async function createTicket(body: {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  type: string;
  image?: string;
}): Promise<{ status?: boolean; message?: string }> {
  try {
    const token = await readAuthToken();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket-store`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (res.status === 401) await deleteToken();
    return res.json();
  } catch (error) {
    console.log('Create ticket error:', error);
    return { status: false, message: 'Failed to create ticket' };
  }
}

/** Submit ticket reply (form-data). Expects FormData with ticket_id, message, image (optional base64) */
export async function submitTicketReply(
  formData: FormData,
): Promise<{ status?: boolean; message?: string }> {
  try {
    const token = await readAuthToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ticket-replay-submit`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    if (res.status === 401) await deleteToken();
    return res.json();
  } catch (error) {
    console.log('Submit ticket reply error:', error);
    return { status: false, message: 'Failed to send reply' };
  }
}

/** Submit payment (multipart/form-data). Expects invoiceId and FormData with pay_slip_image, payment_method, invoice_id */
export async function submitPayment(
  invoiceId: string,
  formData: FormData,
): Promise<{ status?: boolean | string; message?: string; data?: unknown }> {
  try {
    const token = await readAuthToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/submit/${invoiceId}`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    if (res.status === 401) await deleteToken();
    return res.json();
  } catch (error) {
    console.log('Submit payment error:', error);
    return { status: false, message: 'Payment submission failed' };
  }
}

/** User settings with optional profile image (multipart/form-data). Same POST pattern as submitTicketReply / submitPayment. */
export async function submitUserSettingsForm(formData: FormData): Promise<{
  status?: boolean | string;
  message?: string;
  data?: unknown;
  errors?: unknown;
}> {
  try {
    const token = await readAuthToken();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-settings`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    if (res.status === 401) await deleteToken();
    return res.json();
  } catch (error) {
    console.log('User settings form error:', error);
    return { status: false, message: 'Update failed' };
  }
}

/** User settings text fields only (no image re-upload). Use for profile form Update. */
export async function submitUserSettingsTextFields(fields: {
  name: string;
  email: string;
  phone: string;
  emergency_number: string;
  district: string;
  city: string;
  address: string;
}): Promise<{
  status?: boolean | string;
  message?: string;
  data?: unknown;
  errors?: unknown;
}> {
  const formData = new FormData();
  formData.append('name', fields.name);
  formData.append('email', fields.email);
  formData.append('phone', fields.phone);
  formData.append('emergency_number', fields.emergency_number);
  formData.append('district', fields.district);
  formData.append('city', fields.city);
  formData.append('address', fields.address);
  return submitUserSettingsForm(formData);
}

/** User settings with optional existing image path. Re-fetches the image server-side and appends it as `image` (Blob + filename), same multipart shape as a new file upload. Falls back to string path if fetch fails. */
export async function submitUserSettingsWithFields(fields: {
  name: string;
  email: string;
  phone: string;
  emergency_number: string;
  district: string;
  city: string;
  address: string;
  existingImageRelativePath?: string;
}): Promise<{
  status?: boolean | string;
  message?: string;
  data?: unknown;
  errors?: unknown;
}> {
  const formData = new FormData();
  formData.append('name', fields.name);
  formData.append('email', fields.email);
  formData.append('phone', fields.phone);
  formData.append('emergency_number', fields.emergency_number);
  formData.append('district', fields.district);
  formData.append('city', fields.city);
  formData.append('address', fields.address);

  const path = fields.existingImageRelativePath?.trim();
  if (path) {
    const base = (process.env.NEXT_PUBLIC_IMG_URL || '').replace(/\/+$/, '');
    const rel = path.replace(/^\/+/, '');
    const url = base ? `${base}/${rel}` : rel;
    try {
      const imgRes = await fetch(url, { cache: 'no-store' });
      if (imgRes.ok) {
        const buf = await imgRes.arrayBuffer();
        const ct =
          imgRes.headers.get('content-type') || 'application/octet-stream';
        const blob = new Blob([buf], { type: ct });
        const filename = rel.split('/').pop() || 'profile-image';
        formData.append('image', blob, filename);
      } else {
        formData.append('image', path);
      }
    } catch {
      formData.append('image', path);
    }
  }

  return submitUserSettingsForm(formData);
}
