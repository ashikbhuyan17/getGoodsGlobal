'use server';

import { cookies } from 'next/headers';

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
      const cookiesStore = await cookies();
      const token = await cookiesStore.get('token')?.value;
      if (token) headers['Authorization'] = `Bearer ${token}`; // ✅ property modify allowed with const
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      headers,
      ...(revalidate ? { next: { revalidate } } : {}),
      ...(options.cache === 'no-store' ? { cache: 'no-store' } : {}),
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

/** Upload profile photo (multipart/form-data). Expects API endpoint e.g. /user-profile-photo */
export async function uploadProfilePhoto(
  formData: FormData,
): Promise<{ status?: boolean; message?: string; data?: { image?: string } }> {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-profile-photo`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    return res.json();
  } catch (error) {
    console.log('Upload profile photo error:', error);
    return { status: false, message: 'Upload failed' };
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
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ticket-store`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
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
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ticket-replay-submit`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
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
    const cookiesStore = await cookies();
    const token = cookiesStore.get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/payment/submit/${invoiceId}`,
      {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      },
    );
    return res.json();
  } catch (error) {
    console.log('Submit payment error:', error);
    return { status: false, message: 'Payment submission failed' };
  }
}
