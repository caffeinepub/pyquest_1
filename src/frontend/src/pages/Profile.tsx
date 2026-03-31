import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Coins, Flame, Lock, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeType } from "../backend.d";
import {
  useSaveProfile,
  useUserBadges,
  useUserCertificates,
  useUserProfile,
} from "../hooks/useQueries";

const AVATARS = ["🧑‍💻", "👩‍💻", "🦸", "🧙", "🥷", "👾", "🤖", "🦊"];

const ALL_BADGES = [
  {
    emoji: "🔥",
    name: "Week Warrior",
    desc: "7 day streak",
    type: BadgeType.streak,
  },
  {
    emoji: "⚡",
    name: "Speed Demon",
    desc: "Complete level under 1 min",
    type: BadgeType.levelComplete,
  },
  {
    emoji: "🏆",
    name: "Beginner Graduate",
    desc: "Complete stage 1",
    type: BadgeType.stageComplete,
  },
  {
    emoji: "🎯",
    name: "Quiz Master",
    desc: "10 perfect scores",
    type: BadgeType.quizMaster,
  },
  {
    emoji: "💎",
    name: "Diamond Coder",
    desc: "500+ XP in one session",
    type: BadgeType.levelComplete,
  },
  {
    emoji: "🌟",
    name: "Star Student",
    desc: "Complete 5 levels",
    type: BadgeType.levelComplete,
  },
  {
    emoji: "🤖",
    name: "Bot Builder",
    desc: "Complete OOP stage",
    type: BadgeType.stageComplete,
  },
  {
    emoji: "🧙",
    name: "Python Wizard",
    desc: "Complete all 30 levels",
    type: BadgeType.stageComplete,
  },
];

const STAGE_CERTS = [
  {
    stage: "beginner",
    title: "Python Beginner",
    range: "Levels 1-10",
    color: "text-success",
    bg: "bg-success/10 border-success/30",
  },
  {
    stage: "intermediate",
    title: "Python Intermediate",
    range: "Levels 11-20",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/30",
  },
  {
    stage: "advanced",
    title: "Python Advanced",
    range: "Levels 21-30",
    color: "text-warning",
    bg: "bg-warning/10 border-warning/30",
  },
];

export default function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { data: badges } = useUserBadges();
  const { data: certs } = useUserCertificates();
  const saveProfile = useSaveProfile();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const avatarIdx =
    selectedAvatar !== null ? selectedAvatar : Number(profile?.avatar ?? 0);
  const earnedBadgeNames = new Set(badges?.map((b) => b.name) ?? []);

  const xp = Number(profile?.xp ?? 0);
  const coins = Number(profile?.coins ?? 0);
  const streak = Number(profile?.streakDays ?? 0);
  const levelsCompleted = profile?.completedLevels?.length ?? 0;
  const currentLevel = Number(profile?.currentLevel ?? 1);
  const totalBadges = Number(profile?.totalBadges ?? 0);

  const nextLevelXp = currentLevel * 200;
  const xpProgress = Math.min(((xp % nextLevelXp) / nextLevelXp) * 100, 100);

  function handleAvatarSelect(i: number) {
    setSelectedAvatar(i);
    if (profile) {
      saveProfile.mutate(
        { ...profile, avatar: BigInt(i) },
        { onSuccess: () => toast.success("Avatar updated!") },
      );
    }
  }

  function handleSaveName() {
    if (!nameInput.trim() || !profile) return;
    saveProfile.mutate(
      { ...profile, username: nameInput.trim() },
      {
        onSuccess: () => {
          toast.success("Name updated!");
          setEditingName(false);
        },
      },
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div
      className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6"
      data-ocid="profile.page"
    >
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-surface rounded-2xl p-6"
      >
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center text-5xl">
            {AVATARS[avatarIdx]}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              {editingName ? (
                <div className="flex gap-2">
                  <input
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder={profile?.username || "Your name"}
                    className="bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary"
                    data-ocid="profile.input"
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    data-ocid="profile.save_button"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingName(false)}
                    data-ocid="profile.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <h1 className="font-display text-2xl font-bold text-white">
                    {profile?.username || "Python Hero"}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingName(true);
                      setNameInput(profile?.username || "");
                    }}
                    className="text-xs text-primary hover:underline"
                    data-ocid="profile.edit_button"
                  >
                    Edit
                  </button>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm mb-4">
              <Badge className="bg-primary/20 text-primary border-none">
                Level {currentLevel}
              </Badge>
              <Badge className="bg-success/20 text-success border-none">
                🔥 {streak} day streak
              </Badge>
              <Badge className="bg-warning/20 text-warning border-none">
                🏆 {totalBadges} badges
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-custom">
                <span>Level Progress</span>
                <span>{xp.toLocaleString()} XP</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            {
              icon: Zap,
              label: "Total XP",
              value: xp.toLocaleString(),
              color: "text-primary",
            },
            {
              icon: Coins,
              label: "Coins",
              value: coins.toString(),
              color: "text-warning",
            },
            {
              icon: Flame,
              label: "Streak",
              value: `${streak} days`,
              color: "text-game-orange",
            },
            {
              icon: Trophy,
              label: "Levels Done",
              value: levelsCompleted.toString(),
              color: "text-success",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-secondary/50 rounded-xl p-3 flex items-center gap-3"
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <div className="font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-custom">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Avatar Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card-surface rounded-2xl p-6"
      >
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-custom mb-4">
          Choose Avatar
        </h2>
        <div className="flex flex-wrap gap-3">
          {AVATARS.map((emoji, i) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleAvatarSelect(i)}
              className={`w-14 h-14 rounded-xl text-3xl transition-all hover:scale-110 border-2 ${
                avatarIdx === i
                  ? "border-primary bg-primary/20 glow-blue"
                  : "border-border bg-secondary/50 hover:border-primary/40"
              }`}
              data-ocid={`profile.avatar.${i + 1}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card-surface rounded-2xl p-6"
        data-ocid="profile.badges.panel"
      >
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-custom mb-4">
          Badge Collection
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_BADGES.map((badge, i) => {
            const earned =
              earnedBadgeNames.has(badge.name) || (badges && badges.length > i);
            return (
              <div
                key={badge.name}
                className={`rounded-xl p-4 text-center border transition-all ${
                  earned
                    ? "bg-primary/10 border-primary/30"
                    : "bg-secondary/30 border-border/50 opacity-50"
                }`}
                data-ocid={`profile.badge.item.${i + 1}`}
              >
                <div className="text-3xl mb-2">
                  {earned ? (
                    badge.emoji
                  ) : (
                    <Lock className="w-7 h-7 mx-auto text-muted-custom" />
                  )}
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {badge.name}
                </div>
                <div className="text-xs text-muted-custom mt-1">
                  {badge.desc}
                </div>
                {earned && (
                  <Award className="w-3 h-3 text-warning mx-auto mt-2" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Certificates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card-surface rounded-2xl p-6"
        data-ocid="profile.certs.panel"
      >
        <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-custom mb-4">
          Certificates
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {STAGE_CERTS.map((cert, i) => {
            const earned = certs?.some((c) => c.stage === cert.stage);
            return (
              <div
                key={cert.stage}
                className={`rounded-xl p-5 border ${cert.bg}`}
                data-ocid={`profile.cert.item.${i + 1}`}
              >
                <div className={`text-3xl mb-3 ${earned ? "" : "opacity-30"}`}>
                  🎓
                </div>
                <h3
                  className={`font-semibold text-sm mb-1 ${earned ? "text-white" : "text-muted-custom"}`}
                >
                  {cert.title}
                </h3>
                <p className="text-xs text-muted-custom mb-3">{cert.range}</p>
                {earned ? (
                  <Button
                    size="sm"
                    className={`w-full h-8 text-xs bg-primary/20 hover:bg-primary/40 ${cert.color} border-none`}
                    data-ocid={`profile.cert.button.${i + 1}`}
                  >
                    View Certificate
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-custom">
                    <Lock className="w-3.5 h-3.5" />
                    Complete to unlock
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
