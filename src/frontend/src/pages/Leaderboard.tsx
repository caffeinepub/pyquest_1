import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLeaderboard } from "../hooks/useQueries";

const AVATARS = ["🧑‍💻", "👩‍💻", "🦸", "🧙", "🥷", "👾", "🤖", "🦊"];

const SAMPLE_LB = [
  { name: "CodeNinja", xp: 12450, avatar: "🥷", level: 28, badges: 18 },
  { name: "PyWizard", xp: 11200, avatar: "🧙", level: 25, badges: 15 },
  { name: "DataHero", xp: 9800, avatar: "🦸", level: 22, badges: 12 },
  { name: "LoopMaster", xp: 8600, avatar: "🤖", level: 20, badges: 10 },
  { name: "FuncKing", xp: 7900, avatar: "👑", level: 18, badges: 9 },
  { name: "AlgoQueen", xp: 7200, avatar: "👩‍💻", level: 17, badges: 8 },
  { name: "ByteBoss", xp: 6500, avatar: "🧑‍💻", level: 15, badges: 7 },
  { name: "RecurKid", xp: 5800, avatar: "🦊", level: 13, badges: 6 },
  { name: "ClassPro", xp: 4900, avatar: "👾", level: 11, badges: 5 },
  { name: "NewCoder", xp: 3200, avatar: "🦸", level: 8, badges: 3 },
];

const RANK_COLORS = ["text-warning", "text-body", "text-game-orange"];
const RANK_ICONS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useLeaderboard();
  const { identity } = useInternetIdentity();
  const myPrincipal = identity?.getPrincipal().toString();

  const entries =
    leaderboard && leaderboard.length > 0
      ? leaderboard.map(([principal, p], i) => ({
          rank: i + 1,
          name: p.username,
          xp: Number(p.xp),
          level: Number(p.currentLevel),
          badges: Number(p.totalBadges),
          avatar: AVATARS[Number(p.avatar) % AVATARS.length],
          isMe: principal.toString() === myPrincipal,
        }))
      : SAMPLE_LB.map((u, i) => ({ ...u, rank: i + 1, isMe: false }));

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-10"
      data-ocid="leaderboard.page"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Trophy className="w-8 h-8 text-warning" />
          <h1 className="font-display text-4xl font-extrabold text-white">
            Leaderboard
          </h1>
        </div>
        <p className="text-body">Top Python warriors ranked by XP</p>
      </div>

      {!isLoading && entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const actualRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`bg-card-surface rounded-2xl p-4 text-center border ${
                  actualRank === 1
                    ? "border-warning/40 glow-blue"
                    : "border-border"
                } ${i === 1 ? "mt-0" : "mt-6"}`}
              >
                <div className="text-3xl mb-2">
                  {RANK_ICONS[actualRank - 1]}
                </div>
                <div className="text-3xl mb-2">{entry.avatar}</div>
                <div className="font-semibold text-white text-sm truncate">
                  {entry.name}
                </div>
                <div className="text-xs text-muted-custom mt-1">
                  Level {entry.level}
                </div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Zap className="w-3 h-3 text-primary" />
                  <span className="text-sm font-bold text-primary">
                    {entry.xp.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <div
        className="bg-card-surface rounded-2xl overflow-hidden"
        data-ocid="leaderboard.table"
      >
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton loader
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {entries.map((entry, i) => (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                  entry.isMe
                    ? "bg-primary/10 border-l-4 border-l-primary"
                    : "hover:bg-secondary/30"
                }`}
                data-ocid={`leaderboard.item.${i + 1}`}
              >
                <span
                  className={`w-8 text-center font-bold font-display text-lg ${i < 3 ? RANK_COLORS[i] : "text-muted-custom"}`}
                >
                  {i < 3 ? RANK_ICONS[i] : entry.rank}
                </span>
                <span className="text-2xl">{entry.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white truncate">
                      {entry.name}
                    </span>
                    {entry.isMe && (
                      <Badge className="bg-primary/20 text-primary border-none text-xs">
                        You
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-custom">
                    Level {entry.level}
                  </span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary font-bold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{entry.xp.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-custom">
                    {entry.badges} badges
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
