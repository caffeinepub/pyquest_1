import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { SiDiscord, SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(
    typeof window !== "undefined" ? window.location.hostname : "",
  );

  const links = {
    PyQuest: [
      { label: "Home", to: "/" as const },
      { label: "Levels", to: "/levels" as const },
      { label: "Leaderboard", to: "/leaderboard" as const },
      { label: "Profile", to: "/profile" as const },
    ],
    Discover: [
      { label: "Python Basics", to: "/levels" as const },
      { label: "Data Structures", to: "/levels" as const },
      { label: "OOP & Advanced", to: "/levels" as const },
      { label: "Daily Challenges", to: "/levels" as const },
    ],
    Support: [
      { label: "Documentation", to: "/" as const },
      { label: "Community", to: "/" as const },
      { label: "FAQ", to: "/" as const },
    ],
    Legal: [
      { label: "Privacy Policy", to: "/" as const },
      { label: "Terms of Service", to: "/" as const },
    ],
  };

  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                PY<span className="text-accent">QUEST</span>
              </span>
            </div>
            <p className="text-sm text-muted-custom leading-relaxed">
              Master Python through gamified learning adventures.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-custom hover:text-white transition-colors"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-custom hover:text-white transition-colors"
              >
                <SiX className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-custom hover:text-white transition-colors"
              >
                <SiDiscord className="w-5 h-5" />
              </a>
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-custom mb-4">
                {group}
              </h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-body hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-custom">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-custom">
            Learn Python. Level Up. Conquer Code.
          </p>
        </div>
      </div>
    </footer>
  );
}
