import { X } from 'lucide-react';

interface TabsProps {
  tabs: string[];
  selected: string | null;
  setSelected: (tab: string) => void;
  closeTab: (tab: string) => void;
}

export default function Tabs({ tabs, selected, setSelected, closeTab }: TabsProps) {
  return (
    <div className="flex h-9 items-end gap-0 border-b border-white/10 bg-[#0d0d0d] px-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/10">
      {tabs.map((tab) => {
        const isActive = selected === tab;
        const filename = tab.split('/').pop() || 'Untitled';

        return (
          <div
            key={tab}
            className={`relative flex items-center px-3 py-1.5 mr-1 cursor-pointer
              ${isActive ? 'bg-[#1a1a1a] text-white border-t-2 border-blue-500' : 'text-white/60 hover:text-white hover:bg-[#161616]'}`}
            onClick={() => setSelected(tab)}
          >
            <span className="truncate max-w-[140px] text-sm">{filename}</span>
            <X
              size={12}
              className="ml-2 opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab);
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
