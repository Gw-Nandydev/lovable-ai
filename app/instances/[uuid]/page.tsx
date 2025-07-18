// ✅ Fix for app/instances/[uuid]/page.tsx

import { Metadata } from 'next';
import StreamChat from '@/components/StreamChat';

// 👇 params is a Promise now — must be awaited
export async function generateMetadata(
  { params }: { params: Promise<{ uuid: string }> }
): Promise<Metadata> {
  const { uuid } = await params;
  return {
    title: `Instance ${uuid}`,
  };
}

// 👇 Page must also treat params as Promise
export default async function InstancePage(
  { params }: { params: Promise<{ uuid: string }> }
) {
  const { uuid } = await params;

  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col">
      <StreamChat uuid={uuid} />
    </div>
  );
}
