import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

async function inlineStylesFromLinks(html: string, baseUrl: string) {
  const linkRegex =
    /<link[^>]*rel=["']?stylesheet["']?[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const matches = [...html.matchAll(linkRegex)];
  let result = html;

  for (const match of matches) {
    const fullTag = match[0];
    const href = match[1];
    try {
      const absoluteHref = new URL(href, baseUrl).toString();
      const cssRes = await fetch(absoluteHref, { cache: 'no-store' });
      if (!cssRes.ok) continue;
      const cssText = await cssRes.text();
      result = result.replace(fullTag, `<style>${cssText}</style>`);
    } catch {
      // Keep original tag if css fetch fails.
    }
  }

  return result;
}

function sanitizeInvoiceHtml(html: string, baseUrl: string) {
  // JS does not work in excel/html download context; remove script to avoid broken rendering.
  let output = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Make relative image paths absolute.
  output = output.replace(
    /(<img[^>]*\ssrc=["'])(\/[^"']*)(["'][^>]*>)/gi,
    `$1${baseUrl}$2$3`,
  );

  // Ensure base url exists for remaining relative assets.
  if (/<head[^>]*>/i.test(output) && !/<base\s/i.test(output)) {
    output = output.replace(/<head([^>]*)>/i, `<head$1><base href="${baseUrl}/">`);
  }

  // Minimal fallback style so layout remains readable even when upstream css misses.
  if (/<head[^>]*>/i.test(output)) {
    output = output.replace(
      /<\/head>/i,
      `<style>
        body{font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#111;margin:16px}
        table{border-collapse:collapse;width:100%}
        th,td{border:1px solid #ddd;padding:6px;vertical-align:top}
        th{background:#f5f5f5}
      </style></head>`,
    );
  }

  return output;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ invoiceId: string }> },
) {
  const { invoiceId } = await context.params;
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const { searchParams } = new URL(request.url);
  const preview = searchParams.get('preview') === '1';

  if (!apiBase) {
    return NextResponse.json(
      { message: 'API base URL is not configured.' },
      { status: 500 },
    );
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    const upstream = await fetch(
      `${apiBase}/order-print/${encodeURIComponent(invoiceId)}`,
      {
        method: 'GET',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        cache: 'no-store',
      },
    );

    if (!upstream.ok) {
      const errorText = await upstream.text();
      return NextResponse.json(
        { message: errorText || 'Failed to generate invoice file.' },
        { status: upstream.status },
      );
    }

    const upstreamType = upstream.headers.get('content-type') || '';

    // Upstream may return JSON: { status: "success", view: "<!DOCTYPE html>..." }
    if (upstreamType.includes('application/json')) {
      const payload = (await upstream.json()) as {
        status?: string;
        view?: string;
        message?: string;
      };

      if (
        String(payload?.status || '').toLowerCase() === 'success' &&
        payload?.view
      ) {
        const withInlineCss = await inlineStylesFromLinks(payload.view, apiBase);
        const safeHtml = sanitizeInvoiceHtml(withInlineCss, apiBase);
        if (preview) {
          return new NextResponse(safeHtml, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
            },
          });
        }
        return new NextResponse(safeHtml, {
          status: 200,
          headers: {
            'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
            'Content-Disposition': `attachment; filename="${invoiceId}.xls"`,
          },
        });
      }

      return NextResponse.json(
        { message: payload?.message || 'Invalid invoice response format.' },
        { status: 500 },
      );
    }

    const fileBuffer = await upstream.arrayBuffer();
    const contentType = upstreamType || 'application/octet-stream';
    const contentDisposition =
      upstream.headers.get('content-disposition') ||
      `attachment; filename="${invoiceId}.xls"`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Invoice download failed. Please try again.' },
      { status: 500 },
    );
  }
}
