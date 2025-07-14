// Rail.tsx
import { Fragment, useState } from 'react';
import {
  ChevronDown,
  ChevronRight as ArrowRight,
  File,
  Folder,
  FolderOpen
} from 'lucide-react';
import type { TreeNode } from './Explorer';

interface RailProps {
  tree: TreeNode | Record<string, TreeNode>;
  sel: string | null;
  setSel: (val: string) => void;
  isExternal: boolean;
  parentPath: string;
}

const Rail = ({ tree, sel, setSel, isExternal, parentPath }: RailProps) => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const children: TreeNode[] = isExternal
    ? Array.isArray((tree as TreeNode)?.children)
      ? (tree as TreeNode).children as TreeNode[]
      : []
    : Object.values(tree as Record<string, TreeNode>);

  return (
    <div className="overflow-y-auto text-[12px]">
      {children
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        .map((node, index) => {
          const fullPath = node.path && node.path !== '/'
            ? node.path
            : `${parentPath}${parentPath ? '/' : ''}${node.name}`;

          const key = `${fullPath}-${index}`;
          const hasChildren = Array.isArray(node.children)
            ? node.children.length > 0
            : typeof node.children === 'object' && Object.keys(node.children).length > 0;
          const isOpen = open[key];

          return (
            <Fragment key={key}>
              <div
                className={`flex cursor-pointer items-center gap-1 px-2 py-1 hover:bg-[#141414] ${
                  fullPath === sel ? 'bg-[#1e1e1e] text-blue-300' : ''
                }`}
                onClick={() => {
                  if (hasChildren) {
                    setOpen((prev) => ({ ...prev, [key]: !isOpen }));
                  } else {
                    console.log('✅ Selected file:', fullPath);
                    setSel(fullPath);
                  }
                }}
                style={{ paddingLeft: `${12 + (parentPath.split('/').length - 1) * 12}px` }}
              >
                {hasChildren ? (
                  isOpen ? <ChevronDown size={10} /> : <ArrowRight size={10} />
                ) : (
                  <span className="w-[10px]" />
                )}

                {hasChildren ? (
                  isOpen
                    ? <FolderOpen size={12} className="text-yellow-400" />
                    : <Folder size={12} className="text-yellow-400" />
                ) : (
                  <File size={12} className="text-white/50" />
                )}

                <span className="truncate">{node.name}</span>
              </div>

              {hasChildren && isOpen && (
                <Rail
                  tree={node}
                  sel={sel}
                  setSel={setSel}
                  isExternal={isExternal}
                  parentPath={fullPath}
                />
              )}
            </Fragment>
          );
        })}
    </div>
  );
};

export default Rail;
