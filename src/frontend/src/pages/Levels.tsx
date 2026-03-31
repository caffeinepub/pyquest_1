import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, ChevronRight, Lock, Star } from "lucide-react";
import { motion } from "motion/react";
import { useUserProfile } from "../hooks/useQueries";

const STAGE_INFO = [
  {
    name: "Beginner",
    range: "1-10",
    color: "text-success",
    border: "border-success/30",
    bg: "bg-success/10",
    desc: "Variables, strings, conditionals, loops",
  },
  {
    name: "Intermediate",
    range: "11-20",
    color: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/10",
    desc: "Functions, lists, dicts, OOP basics",
  },
  {
    name: "Advanced",
    range: "21-30",
    color: "text-warning",
    border: "border-warning/30",
    bg: "bg-warning/10",
    desc: "Decorators, async, data science, projects",
  },
];

const CERT_LABELS = [
  "Beginner Certificate",
  "Intermediate Certificate",
  "Advanced Certificate",
];

export default function Levels() {
  const { data: profile } = useUserProfile();
  const currentLevel = Number(profile?.currentLevel ?? 6);
  const completedSet = new Set(
    profile?.completedLevels?.map(Number) ?? [1, 2, 3, 4, 5],
  );

  const isUnlocked = (level: number) =>
    level <= currentLevel + 1 || completedSet.has(level);
  const isCompleted = (level: number) => completedSet.has(level);
  const isCurrent = (level: number) => level === currentLevel;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Quest <span className="text-primary">Map</span>
        </h1>
        <p className="text-body">
          30 levels across 3 stages. Conquer them all to become a Python Master.
        </p>
      </div>

      {STAGE_INFO.map((stage, si) => {
        const start = si * 10 + 1;
        const levels = Array.from({ length: 10 }, (_, i) => start + i);

        return (
          <motion.section
            key={stage.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.15 }}
            className={`mb-10 p-6 rounded-2xl border ${stage.border} ${stage.bg}`}
            data-ocid={`levels.stage.${si + 1}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2
                    className={`font-display text-xl font-bold ${stage.color}`}
                  >
                    {stage.name}
                  </h2>
                  <Badge
                    className={`${stage.bg} ${stage.color} border ${stage.border} text-xs`}
                  >
                    Levels {stage.range}
                  </Badge>
                </div>
                <p className="text-sm text-muted-custom">{stage.desc}</p>
              </div>
              <ChevronRight className={`w-5 h-5 ${stage.color}`} />
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {levels.map((level) => {
                const unlocked = isUnlocked(level);
                const completed = isCompleted(level);
                const current = isCurrent(level);

                return unlocked ? (
                  <Link
                    key={level}
                    to="/level/$id"
                    params={{ id: String(level) }}
                    data-ocid={`levels.item.${level}`}
                    className={`relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-bold border transition-all duration-200 ${
                      completed
                        ? "bg-success/20 border-success/40 text-success hover:scale-105"
                        : current
                          ? "bg-primary/30 border-primary/60 text-white glow-blue hover:scale-105 animate-pulse-glow"
                          : "bg-card border-border text-body hover:border-primary/40 hover:text-white hover:scale-105"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : current ? (
                      <Star
                        className="w-5 h-5 text-warning"
                        fill="currentColor"
                      />
                    ) : null}
                    <span className="text-xs">{level}</span>
                    {current && (
                      <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-bold">
                        !
                      </span>
                    )}
                  </Link>
                ) : (
                  <div
                    key={level}
                    data-ocid={`levels.item.${level}`}
                    className="relative aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 text-sm font-bold border bg-secondary/30 border-border/40 text-muted-custom cursor-not-allowed opacity-60"
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-xs">{level}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-xs text-muted-custom">
              {levels.filter(isCompleted).length}/{levels.length} completed
            </div>
          </motion.section>
        );
      })}

      <div className="bg-card-surface rounded-2xl p-6 text-center">
        <h3 className="font-display text-xl font-bold text-white mb-2">
          🏆 Complete All 30 Levels
        </h3>
        <p className="text-body text-sm mb-4">
          Earn the Python Master certificate and exclusive badge
        </p>
        <div className="flex justify-center gap-6">
          {CERT_LABELS.map((cert, i) => (
            <div key={cert} className="flex items-center gap-2 text-sm">
              <div
                className={`w-4 h-4 rounded-full border-2 ${i < 1 ? "bg-success border-success" : "border-border"}`}
              />
              <span className={i < 1 ? "text-success" : "text-muted-custom"}>
                {cert}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
