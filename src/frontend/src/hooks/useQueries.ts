import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserProfile } from "../backend.d";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserBadges() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["badges"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBadges();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUserCertificates() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserCertificates();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useLevelContent(levelId: number) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["level", levelId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getLevel(BigInt(levelId));
    },
    enabled: !!actor && !isFetching && levelId > 0,
  });
}

export function useDailyStreak() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["streak"],
    queryFn: async () => {
      if (!actor) return 0n;
      return actor.checkDailyStreak();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("No actor");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}
