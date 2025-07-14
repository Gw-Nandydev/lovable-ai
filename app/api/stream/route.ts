// app/api/generate/route.ts
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text(); // use .text() for passthrough
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10 * 60 * 1000);
  
  try {
    const backendRes = await fetch('http://golang.n8n-wsk.com:9191/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      signal: controller.signal,
    });

    if (!backendRes.body || !backendRes.ok) {
      const errorText = await backendRes.text();
      console.error('Backend error:', errorText);
      return new Response(`Backend error: ${errorText}`, { status: backendRes.status });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = backendRes.body!.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);

          // 🛡️ Prevent Next.js from rendering HTML
          if (text.startsWith('<!DOCTYPE html>')) {
            controller.close();
            return;
          }

          controller.enqueue(new TextEncoder().encode(text));
        }

        controller.close();
      },
    });

    clearTimeout(timeout);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (err: any) {
    clearTimeout(timeout);
    console.error('❌ Proxy error:', err);
    return new Response('Internal proxy error', { status: 500 });
  }
}
