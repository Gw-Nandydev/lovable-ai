// app/api/history/route.ts
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendURL = process.env.BACKEND_URL || 'http://golang.n8n-wsk.com:9191';
    const query = req.nextUrl.searchParams.toString();
    const fullURL = `${backendURL}/api/history?${query}`;

    const backendRes = await fetch(fullURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error('Backend error:', errorText);
      return new Response(`Backend error: ${errorText}`, { status: backendRes.status });
    }

    const data = await backendRes.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return new Response('Internal proxy error', { status: 500 });
  }
}
