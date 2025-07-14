'use client';
import React, { useEffect, useState } from 'react';
import { Globe, ChevronRight, Bookmark, Loader2, CheckCircle, Code as CodeIcon } from 'lucide-react';
import TypingText from './TypingText';

type Props = {
  file: string;
  preview: string | null;
  onPreview: () => Promise<void> | void;
  onCode: () => void;
};

export default function Card({ file, preview, onPreview, onCode }: Props) {
  const fileName = file.split('/').pop();
  const [status, setStatus] = useState<'typing' | 'ready'>(preview ? 'ready' : 'typing');
  const [typingTrigger, setTypingTrigger] = useState(Date.now());

  useEffect(() => {
    setStatus('typing');
    setTypingTrigger(Date.now());
  }, [file]);

  useEffect(() => {
    if (preview) setStatus('ready');
  }, [preview]);

  const handlePreview = async () => {
    await onPreview();
  };

  return (
    <div
      onClick={handlePreview}
      className={`relative mt-2 ml-2 w-[300px] rounded-lg p-[2px] cursor-pointer ${
        status === 'typing'
          ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-flow-border'
          : 'bg-gray-700'
      }`}
    >
      <div className="rounded-lg bg-[#1a1a1a] p-3 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center">
          <Globe size={16} className="text-white/70" />
          <span className="ml-2 flex-1 truncate">
            {status === 'typing' ? (
              <span className="flex items-center space-x-1">
                <TypingText text="Writing…" speed={100} trigger={typingTrigger} />
                <span className="text-sm font-medium text-white truncate">{fileName}</span>
              </span>
            ) : (
              <span className="text-sm font-medium text-green-400 truncate">Preview Ready</span>
            )}
          </span>
          <ChevronRight size={16} className="text-white/50" />
          <Bookmark size={16} className="ml-2 text-white/50 hover:text-white transition" />
        </div>

        <div className="mt-3 flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            className="flex items-center gap-1 rounded-full bg-[#2a2a2a] px-3 py-1 text-xs text-white hover:bg-[#333] transition"
          >
            {status === 'typing' ? (
              <Loader2 size={12} className="text-white/50 animate-spin" />
            ) : (
              <CheckCircle size={12} className="text-green-400" />
            )}
            <span>{status === 'typing' ? 'Loading' : 'Preview'}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCode();
            }}
            className="flex items-center gap-1 rounded-full bg-[#2a2a2a] px-3 py-1 text-xs text-white hover:bg-[#333] transition"
          >
            <CodeIcon size={12} />
            <span>Code</span>
          </button>
        </div>
      </div>
    </div>
  );
}