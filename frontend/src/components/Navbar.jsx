import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Menu, X, Sun, Moon, ScanLine, LayoutDashboard, History, Info } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const LINKS = [
  { to: "/", label: "Home", icon: Leaf, end: true },
  { to: "/predict", label: "Predict", icon: ScanLine },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/about", label: "About", icon: Info },
];

function NavItem({ to, label, icon: Icon, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
          isActive
            ? "bg-canopy-800 text-paper dark:bg-canopy-400 dark:text-canopy-950"
            : "text-ink/70 hover:text-ink hover:bg-canopy-800/5 dark:text-canopy-100/70 dark:hover:text-canopy-50 dark:hover:bg-canopy-50/5"
        }`
      }
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-canopy-800/10 bg-paper/80 backdrop-blur-md dark:border-canopy-50/10 dark:bg-canopy-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canopy-800 text-paper dark:bg-canopy-400 dark:text-canopy-950">
            <Leaf size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Leaf Clinic</span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-canopy-800/15 text-ink/70 transition hover:border-canopy-800/30 hover:text-ink dark:border-canopy-50/15 dark:text-canopy-100/70 dark:hover:text-canopy-50"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-canopy-800/15 text-ink/70 md:hidden dark:border-canopy-50/15 dark:text-canopy-100/70"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-canopy-800/10 md:hidden dark:border-canopy-50/10"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {LINKS.map((l) => (
                <NavItem key={l.to} {...l} onClick={() => setOpen(false)} />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
