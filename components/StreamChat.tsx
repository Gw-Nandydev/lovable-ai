'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import ChatContainer from '@/components/Chat/ChatContainer';
import HeaderBar from '@/components/Header/HeaderBar';
import Explorer from '@/components/Editor/Explorer';
import Stack from '@/components/Editor/Stack';
import Tabs from '@/components/Editor/Tabs';
import SpinningPreview from '@/components/Preview/SpinningPreview';
import { lastFile, liveFiles, previewUrl, scrub, langFromPath } from '@/components/Chat/helpers';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const USER_ID = 'demo-user-001';
const BRAND = 'GravityDoc';
const LOGO = '/gravitywrite.svg';

export default function StreamChat() {
  const { uuid } = useParams<{ uuid: string }>();
  const [published, setPublished] = useState(false);
  const [log, setLog] = useState<any[]>([]);
  const [draft, setDraft] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [explorer, setExplorer] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [inp, setInp] = useState('');
  const [extTree, setExtTree] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [pageRoutes, setPageRoutes] = useState<string[]>(['/']);
  const [selectedPage, setSelectedPage] = useState<string>('/');

  const togglePreviewMode = () => {
    setPreviewMode((prev) =>
      prev === 'desktop' ? 'tablet' : prev === 'tablet' ? 'mobile' : 'desktop'
    );
  };

  useEffect(() => {
    const appCode = files['src/App.tsx'];
    if (!appCode) return;

    const routePaths: string[] = [];
    const routeRegex = /<Route\s+(?:path="([^"]+)"|index)(?=\s|>)/g;
    let match;

    while ((match = routeRegex.exec(appCode)) !== null) {
      if (match[1]) {
        routePaths.push('/' + match[1].replace(/^\//, ''));
      } else {
        routePaths.push('/');
      }
    }

    const uniqueRoutes = [...new Set(routePaths)].sort();
    setPageRoutes(uniqueRoutes);

    if (!uniqueRoutes.includes(selectedPage)) {
      setSelectedPage('/');
    }
  }, [files]);

  const dingRef = useRef<HTMLAudioElement | null>(null);
  const endRef = useRef<HTMLDivElement>(null!);
  const scroll = () => setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 10);
  const push = (m: any) => setLog(p => [...p, m]);

  useEffect(() => {
    if (!uuid) return;
    const cached = sessionStorage.getItem(`prompt-${uuid}`);
    if (cached) {
      sessionStorage.removeItem(`prompt-${uuid}`);
      push({ role: 'user', content: cached, at: new Date() });
      start(cached);
    }
  }, [uuid]);

  useEffect(() => {
    if (!preview) return;
    if (!dingRef.current) dingRef.current = new Audio('/sound.mp3');
    dingRef.current.play().catch(console.warn);
    setView('preview');
  }, [preview]);

  useEffect(() => {
    if (selected && !openTabs.includes(selected)) {
      setOpenTabs(prev => [...prev, selected]);
    }
  }, [selected]);

  useEffect(() => {
    if (!uuid) return;
    const saved = sessionStorage.getItem(`chatState-${uuid}`);
    const localPrompt = localStorage.getItem(`userPrompt-${uuid}`);

    if (saved) {
      try {
        const state = JSON.parse(saved);
        const hydratedLog = Array.isArray(state.log)
          ? state.log.map((msg: any) => ({
              ...msg,
              at: new Date(msg.at),
              role: msg.role === 'user' ? 'user' : 'ai',
            }))
          : [];

        const fullLog = hydratedLog.length === 0 && localPrompt
          ? [{ role: 'user', content: localPrompt, at: new Date() }]
          : hydratedLog;

        setLog(fullLog);
        setFiles(state.files);
        setOrder(state.order);
        setLast(state.last);
        setPreview(state.preview);
        setOpenTabs(state.openTabs);
        setSelected(state.selected);
        setView(state.view);
        setExplorer(state.explorer);
        setPublished(state.published);
      } catch (err) {
        console.error('Failed to parse saved chat state:', err);
      }
    } else if (localPrompt) {
      setLog([{ role: 'user', content: localPrompt, at: new Date() }]);
    }
  }, [uuid]);

  useEffect(() => {
    if (!uuid) return;
    const state = { log, files, order, last, preview, openTabs, selected, view, explorer, published };
    sessionStorage.setItem(`chatState-${uuid}`, JSON.stringify(state));
  }, [uuid, log, files, order, last, preview, openTabs, selected, view, explorer, published]);

  const start = async (prompt: string) => {
    setStreaming(true);
    setDraft('');
    setFiles({});
    setOrder([]);
    setLast(null);
    setPreview(null);
    setView('preview');
    setExplorer(false);
    setOpenTabs([]);

    const res = await fetch('/api/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: USER_ID, uuid, messages: [{ role: 'user', content: prompt }] })
    });

    if (!res.body) return finish('', {}, []);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';
    let lastUpdate = Date.now();
    let finalFiles: Record<string, string> = {};
    let finalOrder: string[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += decoder.decode(value);

      const now = Date.now();
      if (now - lastUpdate > 1000) {
        setDraft(scrub(buf));
        lastUpdate = now;
      }

      const lf = lastFile(buf);
      if (lf) setLast(lf);

      const live = liveFiles(buf);
      if (Object.keys(live).length) {
        finalFiles = { ...finalFiles, ...live };
        finalOrder = [...finalOrder, ...Object.keys(live)].filter((v, i, a) => a.indexOf(v) === i);
        setFiles(finalFiles);
        setOrder(finalOrder);
      }

      const p = previewUrl(buf);
      if (p) setPreview(p);
    }

    finish(scrub(buf), finalFiles, finalOrder);
  };

  const finish = (
    txt: string,
    filesSnapshot: Record<string, string>,
    orderSnapshot: string[]
  ) => {
    if (txt) {
      const scrubbed = scrub(txt);
      push({
        role: 'ai',
        content: scrubbed,
        at: new Date(),
        file: lastFile(scrubbed) ?? undefined,
        preview: previewUrl(scrubbed) ?? undefined,
        files: filesSnapshot,
        order: orderSnapshot,
      });
    }
    setDraft(null);
    setStreaming(false);
    scroll();
  };

  const send = (e: FormEvent<Element>) => {
    e.preventDefault();
    const v = inp.trim();
    if (!v) return;
    setInp('');
    push({ role: 'user', content: v, at: new Date() });
    scroll();
    start(v);
  };

  const closeTab = (path: string) => {
    setOpenTabs(tabs => tabs.filter(t => t !== path));
    if (selected === path) setSelected(openTabs.find(t => t !== path) || null);
  };
  
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-black text-white">
      <div className="sticky top-0 z-10 flex items-center justify-between h-10 bg-[#0a0a0a] border-b border-white/20 px-4">
        <div className="flex items-center gap-2">
          <img src={LOGO} alt={BRAND} className="h-5 w-5" />
          <span className="text-sm font-semibold text-white">Chat with {BRAND}</span>
        </div>
      </div>
      <main className="flex flex-1 overflow-hidden">
        <aside className="flex flex-col w-[500px] bg-[#111] border-r border-white/10">
          <ChatContainer
            log={log}
            draft={draft}
            push={push}
            last={last}
            preview={preview}
            streaming={streaming}
            inp={inp}
            setInp={setInp}
            send={send}
            endRef={endRef}
            setView={setView}
            setExplorer={setExplorer}
          />
        </aside>
        <section className="flex flex-1 flex-col overflow-hidden">
          <HeaderBar
            ready={view === 'preview' ? !!preview : order.length > 0}
            view={view}
            explorer={explorer}
            toggle={() => setExplorer(e => !e)}
            preview={preview}
            published={published}
            setPublished={setPublished}
            previewMode={previewMode}
            togglePreviewMode={togglePreviewMode}
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageRoutes={pageRoutes}
          />
          {view === 'preview' ? (
            preview ? (
              <div className="flex flex-1 justify-center items-start bg-black overflow-hidden">
                <div
                  className={`transition-all duration-500 ease-in-out shadow-lg rounded-lg overflow-hidden bg-black ${
                    previewMode === 'desktop'
                      ? 'w-full h-full'
                      : previewMode === 'tablet'
                      ? 'w-[768px] h-[100%]'
                      : 'w-[375px] h-[100%]'
                  }`}
                >
                  <iframe
                    src={`${preview}${selectedPage}`}
                    title="Preview"
                    className="w-full h-full border-none rounded-md"
                  />
                </div>
              </div>
            ) : (
              <SpinningPreview />
            )
          ) : explorer ? (
            <div className="flex flex-1 overflow-hidden">
              <Explorer
                files={files}
                order={order}
                sel={selected}
                setSel={setSelected}
                extTree={extTree}
                setExtTree={setExtTree}
                setFiles={setFiles}
                explorer={explorer}
                uuid={uuid}
                USER_ID={USER_ID}
              />
              <div className="flex-1 overflow-y-auto">
                {openTabs.length > 0 && (
                  <Tabs
                    tabs={openTabs}
                    selected={selected}
                    setSelected={setSelected}
                    closeTab={closeTab}
                  />
                )}
                {selected && (
                  <SyntaxHighlighter
                    language={langFromPath(selected)}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '10px 24px',
                      background: 'transparent',
                      fontSize: '12px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre',
                    }}
                    codeTagProps={{ style: { fontSize: '12px', whiteSpace: 'pre' } }}
                    showLineNumbers
                  >
                    {files[selected]?.replace(/\r\n/g, '\n').replace(/^\n+/, '') ?? ''}
                  </SyntaxHighlighter>
                )}
              </div>
            </div>
          ) : (
            <Stack files={files} order={order} onExit={() => setView('preview')} />
          )}
        </section>
      </main>
    </div>
  );
}
