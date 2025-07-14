import { useEffect, useRef } from 'react';

const features = [
  'Collaborate seamlessly with your team',
  'Deploy when your code is ready',
  'Edit and iterate live in the browser',
  'Preview changes instantly',
  'Chat with AI in the sidebar',
];

export default function SpinningPreview() {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const items = listRef.current?.children || [];
    Array.from(items).forEach((el, i) => {
      const element = el as HTMLElement;
      element.style.animationDelay = `${i * 1.2}s`;
      element.style.animationDuration = '1s';
      element.style.animationIterationCount = 'infinite';
    });
  }, []);

  return (
    <div className="flex flex-1 items-center justify-center bg-[#0a0a0a] p-6">
      <div className="rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 p-[2px] shadow-lg transform hover:scale-105 transition-transform duration-300">
        <div className="bg-[#111] rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24">
              <rect width="10" height="10" x="1" y="1" fill="currentColor" rx="1" />
              <rect width="10" height="10" x="1" y="13" fill="currentColor" rx="1" />
              <rect width="10" height="10" x="13" y="13" fill="currentColor" rx="1" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white mb-4">Spinning up preview…</p>
          <ul ref={listRef} className="space-y-2 text-sm text-white/60 text-left">
            {features.map((point, i) => (
              <li key={i} className="animate-pulse-once flex items-start">
                <span className="mr-2 text-blue-500">&bull;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
