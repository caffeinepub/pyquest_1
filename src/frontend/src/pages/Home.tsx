import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Code2,
  Cpu,
  Database,
  Flame,
  Play,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  useDailyStreak,
  useLeaderboard,
  useUserBadges,
  useUserProfile,
} from "../hooks/useQueries";

const PATHS = [
  {
    icon: Code2,
    title: "Python Basics",
    desc: "Variables, data types, operators, and first programs",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    progress: 60,
  },
  {
    icon: Play,
    title: "Functions & Loops",
    desc: "Control flow, functions, and iteration patterns",
    color: "text-success",
    bg: "bg-success/10 border-success/20",
    progress: 20,
  },
  {
    icon: Database,
    title: "Data Structures",
    desc: "Lists, dicts, sets, tuples, and algorithms",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/20",
    progress: 0,
  },
  {
    icon: Cpu,
    title: "OOP & Advanced",
    desc: "Classes, inheritance, decorators, and async",
    color: "text-game-orange",
    bg: "bg-game-orange/10 border-game-orange/20",
    progress: 0,
  },
];

const BADGES = [
  { emoji: "🔥", name: "7-Day Streak", bg: "bg-game-orange/20" },
  { emoji: "🏆", name: "Level 5 Complete", bg: "bg-warning/20" },
  { emoji: "⚡", name: "Speed Coder", bg: "bg-primary/20" },
];

const SAMPLE_LEADERBOARD = [
  { name: "CodeNinja", xp: 12450, avatar: "🥷" },
  { name: "PyWizard", xp: 11200, avatar: "🧙" },
  { name: "DataHero", xp: 9800, avatar: "🦸" },
  { name: "LoopMaster", xp: 8600, avatar: "🤖" },
  { name: "FuncKing", xp: 7900, avatar: "👑" },
];

const AVATARS = ["🧑‍💻", "👩‍💻", "🦸", "🧙", "🥷", "👾", "🤖", "🦊"];
const BADGE_EMOJIS = ["🔥", "⚡", "🏆", "🎯", "💎"];

export default function Home() {
  const { data: profile } = useUserProfile();
  const { data: leaderboard } = useLeaderboard();
  const { data: badges } = useUserBadges();
  const { data: streak } = useDailyStreak();

  const streakDays = streak
    ? Number(streak)
    : Number(profile?.streakDays ?? 12);
  const currentLevel = Number(profile?.currentLevel ?? 6);
  const xp = Number(profile?.xp ?? 3200);
  const completedLevels = profile?.completedLevels?.length ?? 5;
  const levelProgress = Math.min(((currentLevel % 10) / 10) * 100, 100);

  const displayLeaderboard =
    leaderboard && leaderboard.length > 0
      ? leaderboard.slice(0, 5).map(([, p]) => ({
          name: p.username,
          xp: Number(p.xp),
          avatar: AVATARS[Number(p.avatar) % AVATARS.length],
        }))
      : SAMPLE_LEADERBOARD;

  const displayBadges =
    badges && badges.length > 0
      ? badges
          .slice(0, 3)
          .map((b) => ({ emoji: "🏅", name: b.name, bg: "bg-primary/20" }))
      : BADGES;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <section className="grid md:grid-cols-2 gap-8 items-center mb-16 pt-4">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Your Python Quest Awaits
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mb-4">
            Master Python <span className="text-accent">THE GAMIFIED</span> WAY
          </h1>
          <p className="text-body text-lg leading-relaxed mb-8 max-w-md">
            From zero to hero — learn Python through interactive quests,
            debugging battles, and real-world challenges.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-semibold glow-blue transition-all"
              data-ocid="home.primary_button"
            >
              <Link to="/levels">Start Quest →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 px-8 border-border text-body hover:text-white hover:border-primary/50 transition-all"
              data-ocid="home.secondary_button"
            >
              <Link to="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>
          <div className="flex gap-6 mt-8">
            <div>
              <div className="font-display text-2xl font-bold text-white">
                {xp.toLocaleString()}
              </div>
              <div className="text-xs text-muted-custom uppercase tracking-wide">
                Total XP
              </div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-bold text-white">
                {streakDays}
              </div>
              <div className="text-xs text-muted-custom uppercase tracking-wide">
                Day Streak
              </div>
            </div>
            <div className="w-px bg-border" />
            <div>
              <div className="font-display text-2xl font-bold text-white">
                {completedLevels}
              </div>
              <div className="text-xs text-muted-custom uppercase tracking-wide">
                Levels Done
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-75" />
            <img
              src="/assets/generated/hero-coder.dim_600x500.png"
              alt="PyQuest Hero"
              className="relative z-10 w-full max-w-sm md:max-w-md animate-float drop-shadow-2xl rounded-2xl"
            />
            <div className="absolute top-4 -left-4 bg-card-surface rounded-xl px-3 py-2 text-xs font-mono text-accent border border-accent/20 shadow-lg z-20">
              +50 XP ⚡
            </div>
            <div className="absolute bottom-8 -right-4 bg-card-surface rounded-xl px-3 py-2 text-xs font-mono text-warning border border-warning/20 shadow-lg z-20">
              🏆 Level Up!
            </div>
            <div className="absolute top-1/2 -right-6 bg-card-surface rounded-xl px-3 py-2 text-xs font-mono text-primary border border-primary/20 shadow-lg z-20">
              print(&quot;Hello!&quot;)
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-muted-custom mb-5">
          Your Progress
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card-surface rounded-2xl p-5"
            data-ocid="home.card"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-custom">
                Current Quest
              </span>
              <Badge className="bg-primary/20 text-primary border-none text-xs">
                Level {currentLevel}
              </Badge>
            </div>
            <h3 className="font-semibold text-white mb-1">Functions & Loops</h3>
            <p className="text-xs text-muted-custom mb-4">
              Understanding Python functions
            </p>
            <Progress value={levelProgress} className="h-2 mb-2" />
            <div className="flex justify-between text-xs">
              <span className="text-muted-custom">
                {Math.round(levelProgress)}% Complete
              </span>
              <span className="text-warning">Next: +100 XP 🏆</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card-surface rounded-2xl p-5 flex flex-col items-center justify-center text-center"
            data-ocid="home.streak.card"
          >
            <Flame className="w-8 h-8 text-game-orange mb-2" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-custom mb-1">
              Daily Streak
            </span>
            <div className="font-display text-5xl font-extrabold text-white">
              {streakDays}
            </div>
            <div className="text-sm text-body mt-1">Days</div>
            <div className="mt-3 text-xs text-game-orange font-medium">
              🔥 Keep it going!
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card-surface rounded-2xl p-5"
            data-ocid="home.badges.card"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-custom block mb-4">
              Recent Achievements
            </span>
            <div className="space-y-3">
              {displayBadges.map((badge) => (
                <div key={badge.name} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${badge.bg} flex items-center justify-center text-base`}
                  >
                    {badge.emoji}
                  </div>
                  <span className="text-sm text-body">{badge.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-custom">
            Explore Learning Paths
          </h2>
          <Link
            to="/levels"
            className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PATHS.map((path, i) => (
            <motion.div
              key={path.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`bg-card-surface rounded-2xl p-5 border ${path.bg} hover:scale-[1.02] transition-transform cursor-pointer`}
              data-ocid={`home.path.item.${i + 1}`}
            >
              <path.icon className={`w-8 h-8 ${path.color} mb-3`} />
              <h3 className="font-semibold text-white text-sm mb-1">
                {path.title}
              </h3>
              <p className="text-xs text-muted-custom mb-4 leading-relaxed">
                {path.desc}
              </p>
              {path.progress > 0 && (
                <Progress value={path.progress} className="h-1.5 mb-3" />
              )}
              <Button
                asChild
                size="sm"
                className="w-full h-7 text-xs bg-primary/20 hover:bg-primary/40 text-primary border-none"
                data-ocid={`home.path.button.${i + 1}`}
              >
                <Link to="/levels">
                  {path.progress > 0 ? "Resume" : "Begin"}
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-custom mb-1">
                Daily Challenge
              </h2>
              <h3 className="font-display text-xl font-bold text-white">
                Fibonacci Sequence
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs bg-success/20 text-success border border-success/30 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-glow" />
                LIVE
              </span>
              <span className="text-xs text-warning font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +200 XP
              </span>
            </div>
          </div>
          <div className="code-block mb-5 overflow-x-auto">
            <pre className="text-sm leading-relaxed">
              <span className="code-keyword">def </span>
              <span className="code-function">fibonacci</span>(n):{"\n"}
              {"    "}
              <span className="code-keyword">if </span>n &lt;= 1:{"\n"}
              {"        "}
              <span className="code-keyword">return </span>n{"\n"}
              {"    "}
              <span className="code-keyword">return </span>fibonacci(n-1) +
              fibonacci(n-2){"\n\n"}
              <span className="code-comment">
                # Output the first 10 numbers
              </span>
              {"\n"}
              <span className="code-keyword">for </span>i{" "}
              <span className="code-keyword">in </span>range(10):{"\n"}
              {"    "}
              <span className="code-function">print</span>(fibonacci(i))
            </pre>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-semibold glow-blue"
              data-ocid="home.challenge.primary_button"
            >
              <Link to="/level/$id" params={{ id: "1" }}>
                Join the Challenge
              </Link>
            </Button>
            <span className="text-xs text-muted-custom">
              342 coders active now
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card-surface rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-custom">
                Top Coders
              </h3>
              <Link
                to="/leaderboard"
                className="text-xs text-primary hover:underline"
              >
                See all
              </Link>
            </div>
            <div className="space-y-2" data-ocid="home.leaderboard.list">
              {displayLeaderboard.map((user, i) => (
                <div
                  key={user.name}
                  className={`flex items-center gap-3 p-2 rounded-lg ${i === 0 ? "bg-warning/10" : "hover:bg-secondary/50"} transition-colors`}
                  data-ocid={`home.leaderboard.item.${i + 1}`}
                >
                  <span
                    className={`text-sm font-bold w-5 ${i === 0 ? "text-warning" : i === 1 ? "text-body" : i === 2 ? "text-game-orange" : "text-muted-custom"}`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-base">{user.avatar}</span>
                  <span className="text-sm text-white flex-1 truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-primary font-semibold flex items-center gap-0.5">
                    <Zap className="w-3 h-3" />
                    {user.xp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-card-surface rounded-2xl p-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-custom mb-3">
              Recent Badges
            </h3>
            <div className="flex gap-2 flex-wrap">
              {BADGE_EMOJIS.map((emoji) => (
                <div
                  key={emoji}
                  className="w-10 h-10 rounded-xl bg-secondary/70 border border-border flex items-center justify-center text-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
