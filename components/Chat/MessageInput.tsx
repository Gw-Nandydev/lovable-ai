'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { FormEvent, RefObject } from 'react';

type Props = {
  inp: string;
  setInp: (v: string) => void;
  send: (e: FormEvent<HTMLFormElement>) => void;
  streaming: boolean;
};

export default function MessageInput({ inp, setInp, send, streaming }: Props) {
  return (
    <form
      onSubmit={send}
      className="flex items-center gap-2 border-t border-white/10 bg-[#0a0a0a] px-4 py-3"
    >
      <textarea
        rows={1}
        value={inp}
        onChange={e => setInp(e.target.value)}
        className="flex-1 resize-none rounded bg-[#1a1a1a] px-3 py-2 text-[13px] placeholder-white/30 focus:ring-2 focus:ring-blue-500 outline-none transition"
        placeholder="Type a message…"
      />
      <button
        disabled={streaming}
        className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 hover:bg-blue-700 transition"
      >
        {streaming ? (
          <Loader2 className="h-4 w-4 animate-spin text-white" />
        ) : (
          <span className="text-white">➤</span>
        )}
      </button>
    </form>
  );
}