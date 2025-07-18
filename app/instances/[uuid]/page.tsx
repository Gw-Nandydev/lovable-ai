import StreamChat from '@/components/StreamChat';

interface PageProps {
  params: {
    uuid: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="bg-[#0b0b0b] text-white min-h-screen flex flex-col">
      <StreamChat uuid={params.uuid} />
    </div>
  );
}
