export const hhmm = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const lastFile = (t: string) =>
  [...t.matchAll(/<lov-write\s+file_path="([^"]+)">/gi)].pop()?.[1] ?? null;

export const closedFiles = (t: string) =>
  Object.fromEntries([
    ...t.matchAll(/<lov-write\s+file_path="([^"]+)">([\s\S]*?)<\/lov-write>/gi)
  ].map(m => [m[1], m[2].trim()]));

export const liveFiles = (t: string) =>
  Object.fromEntries([
    ...t.matchAll(/<lov-write\s+file_path="([^"]+)">([\s\S]*?)(?=<\/lov-write>|<lov-write|$)/gi)
  ].map(m => [m[1], m[2]]));

export const previewUrl = (t: string) =>
  t.match(/Preview ready:\s*(https?:\/\/\S+)/i)?.[1] ?? null;

export const scrub = (t: string) => {
  const withoutLovCodeBlock = t.replace(/<lov-code>[\s\S]*?<\/lov-code>/gi, '');
  let withoutOpenTags = withoutLovCodeBlock.replace(/<lov-code>[\s\S]*$/gi, '');
  withoutOpenTags = withoutOpenTags
    .replace(/\s+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/(\n[-*] .+?)\n(?!\n|[-*])/g, '$1\n\n');
  return withoutOpenTags.trim();
};

export const langFromPath = (p: string) => {
  const ext = p.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    tsx: 'typescript',
    ts: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    css: 'css',
    scss: 'css',
    json: 'json',
    html: 'html',
    md: 'markdown',
    mdx: 'markdown'
  };
  return langMap[ext] ?? 'tsx';
};
