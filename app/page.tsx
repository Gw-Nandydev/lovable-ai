"use client";
import { useState, useEffect, useRef, ElementType } from "react";
import Image from "next/image";
import {
  FaPaperclip,
  FaPlus,
  FaMoon,
  FaSun,
  FaCog,
  FaSignOutAlt,
  FaQuestionCircle,
  FaRegLightbulb,
  FaArrowUp,
} from "react-icons/fa";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

/* ------------------------------------------------------------------
 * Constants
 * ----------------------------------------------------------------*/
const BRAND = "GravityDoc";
const LOGO = "/gravitywrite.svg";
const quickActions = [
  { label: "Portfolio Site",   prompt: "A personal portfolio website that:\n• Highlights my projects and skills\n• Includes an about section with timeline\n• Features a contact form\nJust the UI for now, I'll hook up a CMS later." },
  { label: "Real‑estate Listings", prompt: "A real‑estate listing platform UI that:\n• Lists properties with image galleries\n• Provides filtering by location, price, and type\n• Includes a map view\nJust the UI; data will come from an API later." },
  { label: "Expense Tracker",     prompt: "An expense tracker app UI that:\n• Lets users add income and expenses\n• Shows a monthly summary chart\n• Supports category filters\nUI only; persistence will be added later." },
  { label: "Fitness Tracker",     prompt: "A fitness tracking dashboard that:\n• Shows workout history\n• Tracks personal records\n• Displays progress charts\nJust the UI first, I'll add Supabase for data persistence later." },
];
const navLinks   = ["Templates", "Pricing", "Blog", "Community"];
const footerCols = [
  { title: "Product",   items: ["Templates", "Pricing", "Integrations"] },
  { title: "Resources", items: ["Blog", "Help Center", "Community"] },
  { title: "Company",   items: ["About", "Careers", "Press"] },
  { title: "Socials",   items: ["Twitter", "LinkedIn", "Reddit"] },
];

/* ------------------------------------------------------------------
 * Main
 * ----------------------------------------------------------------*/
export default function Home() {
  const { theme, setTheme } = useTheme();
  const router              = useRouter();
  const [input, setInput]   = useState("");
  const [recent, setRecent] = useState<{ uuid: string }[]>([]);
  const fileRef             = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setRecent);
  }, []);

  /* --- animated placeholder --- */
  const [ph, setPh] = useState(`Ask ${BRAND} to create a `);
  useEffect(() => {
    const topics = ["portfolio website", "real‑estate listings app", "expense tracker", "fitness tracker", "personal website"];
    let idx = 0, char = 0;
    const id = setInterval(() => {
      const t = topics[idx];
      setPh(`Ask ${BRAND} to create a ${t.slice(0, ++char)}…`);
      if (char === t.length) {
        setTimeout(() => { idx = (idx + 1) % topics.length; char = 0; }, 1200);
      }
    }, 60);
    return () => clearInterval(id);
  }, []);

  /* --- handlers --- */
  const send = () => {
    if (!input.trim()) return;
    const id = uuidv4();
    sessionStorage.setItem(`prompt-${id}`, input);
    localStorage.setItem(`userPrompt-${id}`,input);
    console.log("prmomtid",`prompt-${id}`, input);
     //const storeditem = sessionStorage.getItem(`prompt-${id}`);
     //console.log("stored item from session storage",storeditem)
    router.push(`/instances/${id}`);
  };
  // const send = () => {
  //   if (!input.trim()) return;
  //   const id = uuidv4();
  //   sessionStorage.setItem(`prompt-${id}`, input);
  //   localStorage.setItem(`userPrompt-${id}`, input);
  //   router.push(`/stream-chat/instances/${id}`);
  // };
  
  const attach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setInput((p) => (p ? `${p}\n[Attached ❐ ${f.name}]` : `[Attached ❐ ${f.name}]`));
    e.target.value = "";
  };

  /* --- UI --- */
  return (
    <main className="relative min-h-screen overflow-x-hidden font-sans text-white selection:bg-cyan-500/70">
      {/* linear gradient backdrop */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(90deg,rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
        }}
      />
      {/* subtle stars overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/stars.svg')] opacity-10 mix-blend-screen" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          {/* brand */}
          <div className="flex items-center gap-3 select-none">
            <Image src={LOGO} alt="logo" width={32} height={32} priority />
            <span className="hidden sm:inline-block bg-gradient-to-br from-white via-blue-200 to-cyan-200 bg-clip-text text-2xl font-extrabold text-transparent">
              {BRAND}
            </span>
          </div>
          {/* nav */}
          <nav className="hidden items-center gap-8 text-sm text-cyan-100 md:flex">
            {navLinks.map((l) => (
              <a
                key={l}
                href={`/${l.toLowerCase()}`}
                className="relative transition hover:text-cyan-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-current after:transition-transform hover:after:origin-left hover:after:scale-x-100"
              >
                {l}
              </a>
            ))}
          </nav>
          {/* controls */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-full p-2 text-blue-200 transition hover:rotate-180 hover:text-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
            <Dropdown />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-4xl px-6 pt-28 text-center">
        <h1 className="bg-gradient-to-br from-white via-blue-200 to-cyan-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-6xl">
          Build with <span className="text-cyan-200">{BRAND}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-sm text-cyan-100 md:text-base">
          Idea to app in seconds, with your personal full‑stack engineer.
        </p>
        {/* search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="group mx-auto mt-12 w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-black/60 shadow-xl backdrop-blur-md ring-1 ring-blue-300/20 focus-within:ring-2 focus-within:ring-cyan-400"
        >
          <div className="flex items-center gap-3 px-7 py-6">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-cyan-100 transition hover:text-white"
            >
              <FaPaperclip />
            </button>
            <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg" hidden onChange={attach} />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ph}
              className="flex-1 bg-transparent text-sm placeholder-blue-200 outline-none"
            />
            <button
              type="submit"
              className="rounded-full p-2 transition hover:scale-110 hover:bg-cyan-600/20 focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <FaArrowUp />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/10 bg-black/50 px-7 py-4 text-xs">
            {quickActions.map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => setInput(q.prompt)}
                className="rounded-full bg-black/50 px-4 py-1.5 ring-1 ring-blue-300/20 transition hover:bg-cyan-600/20 hover:ring-cyan-400"
              >
                {q.label}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* PROJECTS */}
      <section className="container mx-auto mt-28 max-w-6xl px-6">
        <div className="rounded-[2.5rem] border border-blue-200/20 bg-black/70 p-12 backdrop-blur-xl shadow-2xl">
          <h2 className="mb-10 text-2xl font-semibold text-cyan-100">Dev’s {BRAND}</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {recent.slice(0, 2).map((p, i) => (
              <Card key={p?.uuid ?? `recent-${i}`} />
            ))}
            <Card create key="create" />
          </div>
          <div className="mt-14 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-cyan-100">From the Community</h3>
            <button className="text-sm text-blue-200 transition hover:text-cyan-200 hover:underline">
              View All
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={`community-${i}`} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-32 bg-black/80 py-16 px-6 text-sm text-cyan-100 backdrop-blur-lg">
        <div className="container mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
          <div>
            <h4 className="mb-2 font-semibold text-white">{BRAND}</h4>
            <p className="text-xs">©{new Date().getFullYear()} GravityDoc Inc.</p>
          </div>
          {footerCols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-2 font-semibold text-white">{col.title}</h4>
              <ul className="space-y-1">
                {col.items.map((i) => (
                  <li key={i} className="cursor-pointer transition-colors hover:text-white">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}

/* ------------------------------------------------------------------
 * Components
 * ----------------------------------------------------------------*/
function Dropdown() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const Item = ({ icon: Icon, children }: { icon: ElementType; children: string }) => (
    <button className="flex w-full items-center gap-2 rounded px-3 py-2 text-cyan-100 hover:bg-cyan-600/10 hover:text-cyan-200">
      <Icon /> {children}
    </button>
  );

  return (
    <div className="relative">
      <button
        className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 font-bold"
        onClick={() => setOpen((o) => !o)}
      >
        D
      </button>
      {open && (
        <div
          ref={ref}
          className="animate-fade-in absolute right-0 top-12 w-72 rounded-xl border border-blue-400/30 bg-black/90 p-4 text-sm backdrop-blur-md shadow-xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 font-bold">D</span>
            <div>
              <p className="font-semibold">Dev’s {BRAND}</p>
              <p className="text-xs text-blue-200">wpdev1212@gmail.com</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-blue-200">Credits Used</p>
            <div className="relative mt-1 h-1.5 w-full rounded bg-blue-700/40">
              <div className="absolute inset-0 w-0 bg-gradient-to-r from-blue-400 to-cyan-400" />
            </div>
            <p className="mt-1 text-xs text-blue-300">0 of your daily credits used</p>
          </div>
          <Item icon={FaCog}>Settings</Item>
          <Item icon={FaPlus}>Invite</Item>
          <div className="mt-4">
            <p className="mb-2 text-xs text-blue-200">Workspaces</p>
            <button className="flex w-full items-center justify-between rounded px-3 py-2 hover:bg-cyan-600/10">
              <span className="flex items-center gap-2">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-cyan-600 text-[10px] font-bold">D</span>
                Dev’s {BRAND}
              </span>
              <span className="rounded bg-blue-700 px-1.5 py-0.5 text-[10px] font-medium text-blue-100">FREE</span>
            </button>
            <Item icon={FaPlus}>Create new workspace</Item>
          </div>
          <Item icon={FaQuestionCircle}>Help Center</Item>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-cyan-100 hover:bg-cyan-600/10 hover:text-cyan-200"
          >
            <FaRegLightbulb /> {theme === "light" ? "Switch to dark" : "Switch to light"}
          </button>
          <Item icon={FaSignOutAlt}>Sign out</Item>
        </div>
      )}
    </div>
  );
}

function Card({ create }: { create?: boolean }) {
  return (
    <div className={`flex h-40 items-center justify-center rounded-2xl border border-dashed border-blue-300/40 bg-black/40 text-sm text-blue-100 transition hover:border-cyan-400 hover:bg-black/50 ${create ? "cursor-pointer" : ""}`}>
      {create ? (
        <>
          <FaPlus className="mr-2" /> Create Project
        </>
      ) : (
        "Project"
      )}
    </div>
  );
}
