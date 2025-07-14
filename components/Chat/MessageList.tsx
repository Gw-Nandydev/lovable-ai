import ReactMarkdown from 'react-markdown';
import Card from './Card';
import { hhmm } from './helpers';

const BRAND = 'GravityDoc';
const LOGO = '/gravitywrite.svg';

interface Message {
  role: 'user' | 'ai';
  content: string;
  at: Date;
  file?: string;
  preview?: string;
}

interface MessageListProps {
  log: Message[];
  draft: string | null;
  last: string | null;
  preview: string | null;
  endRef: React.RefObject<HTMLDivElement>;
  setView: (view: 'preview' | 'code') => void;
  setExplorer: (val: boolean) => void;
}

export default function MessageList({
  log,
  draft,
  last,
  preview,
  endRef,
  setView,
  setExplorer,
}: MessageListProps) {
  const createAiDraftMessage = (content: string): Message => ({
    role: 'ai',
    content,
    at: new Date(),
  });
  
  const messages: Message[] = [...log, ...(draft ? [createAiDraftMessage(draft)] : [])];  

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {messages.map((m, i, a) => (
        <div key={i} className="mb-3">
          {m.role === 'ai' && (
            <div className="mb-1 flex items-center space-x-2 text-[10px]">
              <img src={LOGO} alt={BRAND} className="h-4 w-4 rounded-full" />
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-white/80 font-medium">
                {BRAND}
              </span>
              <span className="text-white/50">•</span>
              <span className="text-white/50">{hhmm(m.at)}</span>
            </div>
          )}
          <div
            className={`max-w-[90%] whitespace-pre-wrap rounded-lg px-3 py-2 text-[13px] leading-[1.5] ${
              m.role === 'user'
                ? 'ml-auto bg-white/10 text-gray-200'
                : 'mr-auto bg-white/5'
            }`}
          >
            {m.role === 'user' ? (
              m.content
            ) : (
              <ReactMarkdown>{m.content}</ReactMarkdown>
            )}
          </div>

          {m.role === 'ai' && i === a.length - 1 && last && (
            <Card
              file={last}
              preview={preview}
              onPreview={() => {
                setExplorer(false);
                setView('preview');
              }}
              onCode={() => {
                setExplorer(false);
                setView('code');
              }}
            />
          )}
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
