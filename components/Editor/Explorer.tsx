// Explorer.tsx
import { useEffect, useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Rail from './Rail';

export interface TreeNode {
  name: string;
  isDir: boolean;
  path?: string;
  content?: string;
  children?: TreeNode[] | Record<string, TreeNode>;
}

interface ExplorerProps {
  files: Record<string, string>;
  order: string[];
  sel: string | null;
  setSel: (val: string) => void;
  extTree: TreeNode | null;
  setExtTree: (t: TreeNode | null) => void;
  setFiles: (f: (prev: any) => any) => void;
  explorer: boolean;
  uuid: string;
  USER_ID: string;
}

const Explorer = ({
  files,
  order,
  sel,
  setSel,
  extTree,
  setExtTree,
  setFiles,
  explorer,
  uuid,
  USER_ID
}: ExplorerProps) => {
  const [query, setQuery] = useState('');
  const [loadingTree, setLoadingTree] = useState(false);
  const [hasShownError, setHasShownError] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!explorer) return;
    setLoadingTree(true);
    setError('');
    setHasShownError(false);

    const fetchTree = async () => {
      try {
        const res = await fetch(
          `http://golang.n8n-wsk.com:9191/api/project-structure?user_id=${USER_ID}&uuid=${uuid}`
        );
        const text = await res.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(text);
        }

        if (!res.ok) throw new Error(data?.message || 'Unknown error');
        setExtTree(data);
      } catch (err: any) {
        if (!hasShownError) {
          setError(err.message || 'Error loading folder structure');
          setHasShownError(true);
        }
        setExtTree(null);
      } finally {
        setLoadingTree(false);
      }
    };

    fetchTree();
  }, [explorer, uuid]);

  const getExtContentByPath = (tree: TreeNode, path: string): string => {
    if (!tree) return '';
    if (!tree.isDir && path.endsWith(tree.name)) {
      return tree.content || '';
    }

    const children = Array.isArray(tree.children)
      ? tree.children
      : Object.values(tree.children || {});

    for (const child of children) {
      const result = getExtContentByPath(child, path);
      if (result !== '') return result;
    }

    return '';
  };

  useEffect(() => {
    if (!sel || !extTree) return;
    const content = getExtContentByPath(extTree, sel);
    if (content) {
      setFiles((prev) => ({ ...prev, [sel]: content }));
    }
  }, [sel, extTree]);

  const buildTree = (): Record<string, TreeNode> => {
    const root: Record<string, TreeNode> = {};

    order.forEach((p) => {
      const parts = p.split('/');
      let current = root;

      parts.forEach((seg, i) => {
        if (!current[seg]) {
          current[seg] = {
            name: seg,
            isDir: i < parts.length - 1,
            children: i < parts.length - 1 ? {} : undefined,
            path: i === parts.length - 1 ? p : undefined,
          };
        }
        if (i < parts.length - 1) {
          current = current[seg].children as Record<string, TreeNode>;
        }
      });
    });

    return root;
  };

  const filterTree = (node: Record<string, TreeNode>): Record<string, TreeNode> => {
    if (!query.trim()) return node;
    const out: Record<string, TreeNode> = {};

    for (const n of Object.values(node)) {
      if (
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.path?.toLowerCase().includes(query.toLowerCase())
      ) {
        out[n.name] = n;
      } else if (n.children && !Array.isArray(n.children)) {
        const c = filterTree(n.children);
        if (Object.keys(c).length) {
          out[n.name] = { ...n, children: c };
        }
      }
    }

    return out;
  };

  const filterExternalTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null;
    const matches = node.name.toLowerCase().includes(query.toLowerCase());
    const children = Array.isArray(node.children) ? node.children : [];
    const filteredChildren = children
      .map((child) => filterExternalTree(child))
      .filter((child): child is TreeNode => !!child);

    if (matches || filteredChildren.length > 0) {
      return { ...node, children: filteredChildren };
    }

    return null;
  };

  const tree = extTree ? filterExternalTree(extTree) : filterTree(buildTree());

  return (
    <div className="w-64 flex flex-col border-r border-white/10 bg-[#0a0a0a]">
      <div className="flex h-9 items-center gap-2 border-b border-white/10 px-2 py-1">
        <Search size={12} className="opacity-60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files…"
          className="flex-1 bg-transparent text-[11px] outline-none placeholder:opacity-40"
        />
      </div>
      {error && (
        <div className="text-red-400 text-xs px-2 py-2 border-b border-white/10 bg-[#1a1a1a]">
          {error}
        </div>
      )}
      {loadingTree ? (
        <div className="flex flex-1 items-center justify-center text-xs text-gray-400 py-4">
          <Loader2 className="animate-spin mr-2" size={14} />
          Loading folder structure…
        </div>
      ) : (
        tree && (
          <Rail
            tree={tree}
            sel={sel}
            setSel={setSel}
            isExternal={!!extTree}
            parentPath=""
          />
        )
      )}
    </div>
  );
};

export default Explorer;
