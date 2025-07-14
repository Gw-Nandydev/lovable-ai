import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendRes = await fetch('http://golang.n8n-wsk.com:9191/api/projects');

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error('Backend error:', errorText);
      return new Response(errorText, { status: backendRes.status });
    }

    const data = await backendRes.text(); // Supabase returns JSON text
    return new Response(data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error('❌ Proxy error:', err);
    return new Response('Failed to load projects from Go server', {
      status: 500,
    });
  }
}
