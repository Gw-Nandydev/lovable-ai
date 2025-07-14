'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader2, MonitorSmartphone, Code2, Zap, Github, Globe } from 'lucide-react';

interface HeaderProps {
  ready: boolean;
  view: 'preview' | 'code';
  explorer: boolean;
  toggle: () => void;
  preview: string | null;
  published: boolean;
  setPublished: (p: boolean) => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  togglePreviewMode: () => void;
  selectedPage: string;
  setSelectedPage: (page: string) => void;
  pageRoutes: string[];
}

export default function Header({
  ready,
  view,
  explorer,
  toggle,
  preview,
  published,
  setPublished,
  previewMode,
  togglePreviewMode,
  selectedPage,
  setSelectedPage,
  pageRoutes,
}: HeaderProps) {
  const [showPublish, setShowPublish] = useState(false);
  const [showGitHub, setShowGitHub] = useState(false);
  const [showSupabase, setShowSupabase] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const publishRef = useRef<HTMLDivElement>(null);
  const githubRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef<HTMLDivElement>(null);
  const inviteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (publishRef.current && !publishRef.current.contains(e.target as Node)) setShowPublish(false);
      if (githubRef.current && !githubRef.current.contains(e.target as Node)) setShowGitHub(false);
      if (supabaseRef.current && !supabaseRef.current.contains(e.target as Node)) setShowSupabase(false);
      if (inviteRef.current && !inviteRef.current.contains(e.target as Node)) setShowInvite(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex h-10 items-center justify-between border-b border-white/10 bg-[#0c0c0c] px-4 text-sm">
      <div className="flex items-center space-x-3">
        {ready ? (
          <span className="text-green-400 text-lg">●</span>
        ) : (
          <Loader2 className="h-4 w-4 animate-spin text-white/70" />
        )}
        <button onClick={togglePreviewMode} title="Cycle Preview Modes">
          <MonitorSmartphone
            size={18}
            className={`text-white/80 transition ${
              previewMode !== 'desktop' ? 'text-blue-400' : ''
            }`}
          />
        </button>

        {view === 'preview' ? (
          <div className="relative">
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="bg-[#1a1a1a] text-white/90 text-sm font-medium pl-2 pr-6 py-1 rounded border border-white/10 appearance-none focus:outline-none"
            >
              {pageRoutes.map((route) => (
                <option key={route} value={route} className="text-black">
                  {route === '/' ? 'Home Page' : route}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1.5 text-white/50 text-xs">
              ▼
            </div>
          </div>
        ) : (
          <span className="font-medium text-white/90">Code</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggle}
          title="Toggle Code Viewer"
          className={`p-2 rounded-md transition ${
            explorer
              ? 'bg-blue-600 text-white shadow'
              : 'bg-[#111] hover:bg-[#222] text-white/70'
          }`}
        >
          <Code2 size={18} />
        </button>

         {/* Supabase dropdown */}
         <div className="relative" ref={supabaseRef}>
          <button
            onClick={() => setShowSupabase(v => !v)}
            className="p-2 rounded-md bg-[#111] hover:bg-[#222] transition"
          >
            <Zap size={18} className="text-green-400" />
          </button>
          {showSupabase && (
            <div className="absolute right-0 mt-2 w-64 rounded bg-[#1a1a1a] border border-white/10 p-4 text-xs shadow-lg">
              <h3 className="mb-2 font-semibold text-white">Supabase</h3>
              <p className="text-white/60 mb-3 leading-snug">
                Integrate user authentication,<br /> data storage, and backend capabilities.
              </p>
              <a
                href="https://supabase.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-white/10 bg-white text-black px-3 py-1 text-xs font-medium hover:bg-gray-100 transition"
              >
                <Zap size={12} className="text-green-500" /> Connect Supabase
              </a>
            </div>
          )}
        </div>

        {/* GitHub dropdown */}
        <div className="relative" ref={githubRef}>
          <button
            onClick={() => setShowGitHub(v => !v)}
            className="p-2 rounded-md bg-[#111] hover:bg-[#222] transition"
          >
            <Github size={18} className="text-white/70" />
          </button>
          {showGitHub && (
            <div className="absolute right-0 mt-2 w-64 rounded bg-[#1a1a1a] border border-white/10 p-4 text-xs shadow-lg">
              <h3 className="mb-2 font-semibold text-white">GitHub</h3>
              <p className="text-white/60 mb-3">
                Sync your project 2-way with GitHub to collaborate at source.
              </p>
              <a
                href="https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-white/10 bg-white text-black px-3 py-1 text-xs font-medium hover:bg-gray-100 transition"
              >
                <Github size={12} /> Connect GitHub
              </a>
            </div>
          )}
        </div>

        {/* Invite dropdown */}
        <div className="relative" ref={inviteRef}>
          <button
            onClick={() => setShowInvite(v => !v)}
            className="px-3 py-1 rounded-md bg-[#111] hover:bg-[#222] border border-white/20 text-white text-sm transition"
          >
            Invite
          </button>
          {showInvite && (
            <div className="absolute right-0 mt-2 w-72 rounded bg-[#1a1a1a] border border-white/10 p-4 text-xs shadow-lg">
              <h3 className="mb-1 font-semibold text-white">Invite</h3>
              <p className="text-white/60 text-[11px] mb-3">
                Collaborate on this project, sharing credits.{' '}
                <a href="#" className="text-blue-400 underline">Upgrade your plan</a> for more permissions handling.
              </p>
              <div className="flex items-center mb-3">
                <input
                  type="email"
                  placeholder="Invite by email"
                  className="flex-1 rounded bg-[#111] border border-white/10 px-2 py-[5px] text-[11px] text-white placeholder-white/30 outline-none"
                />
                <button className="ml-2 rounded bg-white/10 px-2 py-[5px] text-[11px] text-white hover:bg-white/20">Invite</button>
              </div>
              <div className="border-t border-white/10 pt-2 text-white/80">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-orange-500 text-xs flex items-center justify-center font-bold">N</div>
                  <div className="flex flex-col text-xs">
                    <span>naganandhini3012@gmail.com <span className="text-white/40">(you)</span></span>
                    <span className="text-white/40 text-[10px]">Owner</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-white/50 text-[11px]">Upgrade to collaborate</span>
                <button className="text-white text-[11px] px-3 py-[5px] rounded bg-white/10 hover:bg-white/20">Upgrade</button>
              </div>
            </div>
          )}
        </div>

        {/* Publish dropdown */}
        <div className="relative" ref={publishRef}>
          <button
            onClick={() => setShowPublish(v => !v)}
            className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
          >
            Publish
          </button>
          {showPublish && (
            <div className="absolute right-0 mt-2 w-64 rounded bg-[#1a1a1a] border border-white/10 p-4 text-xs shadow-lg">
              <h3 className="mb-2 font-semibold text-white">Publish</h3>
              <p className="text-white/60 mb-2">
                Publish your project to make it visible for others on the internet.
              </p>
              {preview ? (
                <>
                  <div className="flex items-center gap-1 text-white text-[12px] mb-1">
                    <Globe size={12} className="text-white/40" />
                    <span className="truncate">{preview}</span>
                  </div>
                  <div className="text-blue-400 text-[11px] cursor-pointer hover:underline mb-3">+ Custom domains</div>
                </>
              ) : (
                <div className="text-white/30 italic mb-2">No preview URL generated yet.</div>
              )}
              <div className="flex justify-between mt-2">
                <button className="text-white/50 hover:text-white text-[11px]">Review Security</button>
                <button
                  onClick={() => setPublished(true)}
                  className="bg-blue-600 text-white text-[11px] px-3 py-[3px] rounded"
                >
                  {published ? 'Update' : 'Publish'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
