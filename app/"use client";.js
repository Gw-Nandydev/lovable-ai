"use client";
import { useState, useEffect, useRef } from "react";
import {FaPaperclip,FaPlus,FaMoon,FaSun,FaCog,FaSignOutAlt,FaQuestionCircle,FaRegLightbulb,FaChevronRight,FaChevronLeft,FaArrowUp,
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';

interface Project {
  uuid: string;
  content?: string;
  created_at: string;
}
const BRAND = "Gravity Docs";
const LOGO = '/gravitywrite.svg';
export default function Home() {
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [recent, setRecent] = useState<Project[]>([]);
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => setRecent(data));
  }, []);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const uuid = uuidv4();
    sessionStorage.setItem(`prompt-${uuid}`, input);
    router.push(`/instances/${uuid}`);
  };
  const pickFile = () => fileRef.current?.click();
  const attachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput((prev) => `${prev}${prev ? "\n" : ""}[Attached ❐ ${file.name}]`);
    e.target.value = ""; // allow re‑pick
  };
  const send = () => {
    if (!input.trim()) return;
    router.push(`/chat?message=${encodeURIComponent(input)}`);
    setInput("");
  };
  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };
   const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput((prev) => (prev.trim() ? `${prev} [${file.name}]` : `[${file.name}]`));
  };
  /* 🔤 Auto‑typing placeholder */
  const staticPrefix = `Ask ${BRAND} to create a `;
  const topics = [
    "portfolio website",
    "real estate listings app",
    "expense tracker",
    "fitness tracker",
    "personal website",
  ];
  const [placeholder, setPlaceholder] = useState(staticPrefix);
  const [topicIdx, setTopicIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const typing = setInterval(() => {
      const current = topics[topicIdx];
      if (charIdx < current.length) {
        setCharIdx((c) => c + 1);
        setPlaceholder(staticPrefix + current.slice(0, charIdx + 1) + "…");
      } else {
        setTimeout(() => {
          setTopicIdx((i) => (i + 1) % topics.length);
          setCharIdx(0);
        }, 1500);
      }
    }, 80);
    return () => clearInterval(typing);
  }, [charIdx, topicIdx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        (document.getElementById("idea-input") as HTMLInputElement)?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* --------------------------- profile dropdown --------------------------- */
  const [menuOpen, setMenuOpen] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setAppearanceOpen(false);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

    /* -------------------------- Quick‑action data ---------------------------- */
    const quickActions = [
      {
        label: "Portfolio Site",
        prompt:
          "A personal portfolio website that:\n• Highlights my projects and skills\n• Includes an about section with timeline\n• Features a contact form\nJust the UI for now, I'll hook up a CMS later.",
      },
      {
        label: "Real‑estate Listings",
        prompt:
          "A real‑estate listing platform UI that:\n• Lists properties with image galleries\n• Provides filtering by location, price, and type\n• Includes a map view\nJust the UI; data will come from an API later.",
      },
      {
        label: "Expense Tracker",
        prompt:
          "An expense tracker app UI that:\n• Lets users add income and expenses\n• Shows a monthly summary chart\n• Supports category filters\nUI only; persistence will be added later.",
      },
      {
        label: "Fitness Tracker",
        prompt:
          "A fitness tracking dashboard that:\n• Shows workout history\n• Tracks personal records\n• Displays progress charts\nJust the UI first, I'll add Supabase for data persistence later.",
      },
    ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden font-sans antialiased text-white bg-[radial-gradient(ellipse_at_center,_#2563eb_0%,_#1e3a8a_55%,_#000_100%)]">
      {/* ------------------------------- Header ------------------------------- */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md">
        {/* brand */}
        <div className="text-lg font-extrabold tracking-tight">{BRAND}</div>
        {/* right controls */}
        <div className="relative flex items-center gap-3">
          {/* theme toggle */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="rounded-full p-2 text-sky-300 transition hover:scale-110 hover:text-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>
          {/* avatar */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            D
          </button>
          {/* ---------- dropdown ---------- */}
          {menuOpen && (
            <div ref={menuRef} className="absolute right-0 top-12 flex text-sm">
              {/* main panel */}
              <div className="w-72 rounded-xl border border-white/10 bg-black/90 p-4 shadow-lg backdrop-blur-md">
                {/* profile header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-base font-bold">D</span>
                  <div>
                    <p className="font-semibold">Dev’s {BRAND}</p>
                    <p className="text-xs text-gray-400">wpdev1212@gmail.com</p>
                  </div>
                </div>

                {/* credits */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400">Credits Used</p>
                  <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded bg-gray-700">
                    <div className="absolute inset-0 w-0 bg-sky-600" />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">0 of your daily credits used</p>
                </div>

                {/* menu buttons */}
                <button className="flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-white/5">
                  <FaCog /> Settings
                </button>
                <button className="flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-white/5">
                  <FaPlus /> Invite
                </button>

                {/* workspaces */}
                <div className="mt-4">
                  <p className="mb-2 text-xs text-gray-400">Workspaces</p>
                  <button className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-white/5">
                    <span className="flex items-center gap-2">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-sky-600 text-[10px] font-bold">D</span>
                      Dev’s {BRAND}
                    </span>
                    <span className="rounded bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-200">FREE</span>
                  </button>
                  <button className="flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-white/5">
                    <FaPlus className="text-xs" /> Create new workspace
                  </button>
                </div>

                <button className="mt-4 flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-white/5">
                  <FaQuestionCircle /> Help Center
                </button>

                <button
                  onClick={() => setAppearanceOpen((o) => !o)}
                  className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-white/5"
                >
                  <span className="flex items-center gap-2">
                    <FaRegLightbulb /> Appearance
                  </span>
                  <FaChevronRight className="opacity-70" />
                </button>

                <button className="mt-1 flex w-full items-center gap-2 rounded px-3 py-2 hover:bg-white/5">
                  <FaSignOutAlt /> Sign out
                </button>
              </div>

              {/* appearance submenu */}
              {appearanceOpen && (
                <div className="ml-1 w-48 rounded-xl border border-white/10 bg-black/90 p-2 shadow-lg backdrop-blur-md">
                  {[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System theme", value: "system" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setTheme(opt.value);
                        setAppearanceOpen(false);
                        setMenuOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left hover:bg-white/5 ${
                        theme === opt.value || (theme === undefined && opt.value === "system") ? "bg-white/5" : ""
                      }`}
                    >
                      {opt.label}
                      {theme === opt.value || (theme === undefined && opt.value === "system") ? (
                        <FaChevronLeft className="text-xs" />
                      ) : null}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* ------------------------------- Hero ------------------------------- */}
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 text-center">
        <h1 className="bg-gradient-to-br from-white via-sky-200 to-blue-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
          Build something with  <span className="text-blue-300">{BRAND}</span>
        </h1>
        <p className="mt-5 max-w-lg text-sm text-gray-200 md:text-base">
          Idea to app in seconds, with your personal full‑stack engineer.
        </p>

        {/* --------------------------- Search card --------------------------- */}
        <div className="group mt-10 w-full max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3 px-6 py-5">
            {/* Attachment icon */}
            <button onClick={handleAttachmentClick} className="mr-2 text-gray-400 hover:text-gray-200" aria-label="Attach image (PNG or JPG)">
              <FaPaperclip />
            </button>

            {/* hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              id="idea-input"
              type="text"
              placeholder={placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm placeholder-gray-400 outline-none"
            />
      
          <button onClick={handleSubmit} aria-label="Send" className="rounded-full p-2 transition hover:scale-110 hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
              <FaArrowUp />
            </button>
          </div>

           {/* Quick action chips */}
        <div className="flex flex-wrap gap-2 border-t border-white/10 px-6 py-4 text-xs">
          {quickActions.map(({ label, prompt }) => (
            <button
              key={label}
              className="rounded-full bg-black/60 px-4 py-1.5 backdrop-blur-md ring-1 ring-inset ring-white/10 transition hover:bg-black/70"
              onClick={() => setInput(prompt)}
            >
              {label}
            </button>
          ))}
        </div>
        </div>
      </section>

      {/* --------------------- Projects & Community --------------------- */}
      <section className="mx-auto mt-24 w-full max-w-6xl px-6">
        <div className="rounded-3xl border border-white/10 bg-black/40 p-10 backdrop-blur-md">
          <h2 className="mb-8 text-2xl font-semibold">Dev’s {BRAND}</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard isCreate />
          </div>

          <div className="mt-12 flex items-center justify-between">
            <h3 className="text-xl font-semibold">From the Community</h3>
            <button className="text-sm text-gray-400 hover:text-white hover:underline">View All</button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <PlaceholderCard key={idx} />
            ))}
          </div>
        </div>
      </section>


       {/* Footer – updated for Gravity Docs */}
       <footer className="bg-[#111] mt-20 py-12 px-6 text-sm text-gray-400">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-2">Gravity Docs</h4>
            <p className="text-xs">© {new Date().getFullYear()} Gravity Docs Inc.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Product</h4>
            <ul className="space-y-1">
              <li>Templates</li>
              <li>Pricing</li>
              <li>Integrations</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Resources</h4>
            <ul className="space-y-1">
              <li>Blog</li>
              <li>Help Center</li>
              <li>Community</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Socials</h4>
            <ul className="space-y-1">
              <li>Twitter</li>
              <li>LinkedIn</li>
              <li>Reddit</li>
            </ul>
          </div>

        </div>
      </footer>
    </main>
  );
}

function PlaceholderCard({ isCreate = false }: { isCreate?: boolean }) {
  return (
    <div
      className={`flex h-40 items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 text-sm text-gray-400 transition hover:border-white/25 hover:bg-black/40 ${
        isCreate ? "cursor-pointer" : ""
      }`}
    >
      {isCreate ? (
        <>
          <FaPlus className="mr-2" /> Create Project
        </>
      ) : (
        "Project"
      )}
    </div>
  );
}
