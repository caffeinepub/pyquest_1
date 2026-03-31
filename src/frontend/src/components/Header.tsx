import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Coins, Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const AVATARS = ["🧑‍💻", "👩‍💻", "🦸", "🧙", "🥷", "👾", "🤖", "🦊"];

export default function Header() {
  const location = useLocation();
  const { identity, clear } = useInternetIdentity();
  const { actor, isFetching } = useActor();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });

  const navLinks = [
    { label: "Home", to: "/" as const },
    { label: "Levels", to: "/levels" as const },
    { label: "Leaderboard", to: "/leaderboard" as const },
    { label: "Profile", to: "/profile" as const },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const avatarEmoji = AVATARS[Number(profile?.avatar ?? 0) % AVATARS.length];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center glow-blue">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <span className="font-display text-xl font-bold tracking-wide text-white">
            PY<span className="text-accent">QUEST</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={`nav.${link.label.toLowerCase()}.link`}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(link.to)
                  ? "text-white bg-primary/20 border border-primary/30"
                  : "text-body hover:text-white hover:bg-secondary/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          {profile && (
            <div className="flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-3 py-1.5">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-semibold text-white">
                {Number(profile.xp).toLocaleString()}
              </span>
              <Coins className="w-3.5 h-3.5 text-warning ml-1" />
              <span className="text-sm font-semibold text-white">
                {Number(profile.coins)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary/30 text-base">
                {avatarEmoji}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white max-w-[100px] truncate">
              {profile?.username || "Hero"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-white"
            onClick={clear}
            data-ocid="nav.logout.button"
          >
            Logout
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden ml-auto p-2 text-body"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive(link.to)
                  ? "text-white bg-primary/20"
                  : "text-body hover:text-white hover:bg-secondary/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {identity && (
            <button
              type="button"
              onClick={() => {
                clear();
                setMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
