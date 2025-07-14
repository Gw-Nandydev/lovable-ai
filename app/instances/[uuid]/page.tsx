import StreamChat from '@/components/StreamChat';

export default function InstancePage({ params }: { params: { uuid: string } }) {
  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col">
      <StreamChat uuid={params.uuid} />
    </div>
  );
}
