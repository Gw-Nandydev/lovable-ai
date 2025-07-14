import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { langFromPath } from '../Chat/helpers';

type StackProps = {
  files: Record<string, string>;
  order: string[];
  onExit: () => void;
  onRaw?: () => void;
  onDiff?: () => void;
};

export default function Stack({ files, order, onExit, onRaw, onDiff }: StackProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [openPaths, setOpenPaths] = useState<Record<string, boolean>>({});

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [files]);

  const togglePath = (path: string) => {
    setOpenPaths(prev => ({ ...prev, [path]: !(prev[path] ?? true) }));
  };

  const isFile = (path: string) => !path.endsWith('/');

  return (
    <div ref={ref} className="flex-1 overflow-y-auto bg-[#0a0a0a] font-mono text-[12px] text-slate-300">
      {/* Top bar */}
      <div className="flex h-8 items-center justify-between border-b border-white/10 bg-[#111] px-4 text-[11px]">
        <div className="flex gap-3 items-center">
          <button
            onClick={onExit}
            type="button"
            className="text-[11px] px-2 py-1 font-medium text-white hover:bg-white hover:text-blue-700 rounded"
          >
            ‹ Exit <span className="opacity-60">ESC</span>
          </button>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onRaw}
            className="opacity-60 hover:text-white focus:outline-none"
          >
            Raw
          </button>
          <button
            onClick={onDiff}
            className="opacity-60 hover:text-white focus:outline-none"
          >
            Diff
          </button>
        </div>
      </div>

      {/* File explorer */}
      {order.map((path) => {
        const isOpen = openPaths[path] ?? true;
        return (
          <div key={path}>
            <div
              onClick={() => togglePath(path)}
              className="flex items-center justify-between px-6 py-2 bg-[#0a0a0a] border-b border-white/10 cursor-pointer hover:bg-[#161b22]"
            >
              <div className="flex items-center gap-2 truncate">
                {isFile(path)
                  ? <File size={16} className="text-green-400" />
                  : <Folder size={16} className="text-yellow-400" />}
                <span className="truncate font-medium text-white">{path}</span>
              </div>
              {isOpen
                ? <ChevronDown size={14} className="text-white/60" />
                : <ChevronRight size={14} className="text-white/60" />}
            </div>

            {isOpen && (
              <div className="px-6 bg-[#0d1117]">
                <SyntaxHighlighter
                  language={langFromPath(path)}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: '12px 16px',
                    background: 'transparent',
                    fontSize: '12px',
                    lineHeight: '1.5',
                  }}
                  codeTagProps={{ style: { fontFamily: 'inherit', fontSize: '12px', whiteSpace: 'pre' } }}
                  showLineNumbers
                >
                  {files[path]?.replace(/\r\n/g, '\n').replace(/^\n+/, '')}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
