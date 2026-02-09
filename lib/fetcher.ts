'use server';

import { cookies } from 'next/headers';

export async function fetcher<T>(
  slug: string,
  options: RequestInit = {},
  revalidate: number | false = 0,
): Promise<T> {
  try {
    const cookiesStore = await cookies();
    const token = await cookiesStore.get('token')?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${slug}`, {
      ...options,
      next: revalidate ? { revalidate } : undefined,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        'Content-Type': 'application/json',
      },
    });

    return res.json() as Promise<T>;
  } catch (error) {
    console.log('Fetcher Error:', error);
    throw error;
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
