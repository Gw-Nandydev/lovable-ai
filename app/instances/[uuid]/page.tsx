// app/instances/[uuid]/page.tsx
import { Metadata } from 'next';
import StreamChat from '@/components/StreamChat';

export async function generateMetadata(
  { params }: { params: { uuid: string } }
): Promise<Metadata> {
  return {
    title: `Instance ${params.uuid}`,
  };
}

export default function InstancePage(
  { params }: { params: { uuid: string } }
) {
  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col">
      <StreamChat uuid={params.uuid} />
    </div>
  );
}
