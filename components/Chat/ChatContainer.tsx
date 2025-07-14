'use client';

import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { FormEvent, RefObject } from 'react';

type ChatContainerProps = {
  log: any[];
  draft: string | null;
  push: (msg: any) => void;
  last: string | null;
  preview: string | null;
  streaming: boolean;
  inp: string;
  setInp: (val: string) => void;
  send: React.FormEventHandler<HTMLFormElement>; 
  endRef: RefObject<HTMLDivElement>;
  setView: (val: 'preview' | 'code') => void;
  setExplorer: (val: boolean) => void;
};

export default function ChatContainer({
  log,
  draft,
  push,
  last,
  preview,
  streaming,
  inp,
  setInp,
  send,
  endRef,
  setView,
  setExplorer,
}: ChatContainerProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageList
          log={log}
          draft={draft}
          last={last}
          preview={preview}
          endRef={endRef}
          setView={setView}
          setExplorer={setExplorer}
        />
      </div>
      <div className="border-t border-white/10">
        <MessageInput
          inp={inp}
          setInp={setInp}
          send={send}
          streaming={streaming}
        />
      </div>
    </div>
  );
}

