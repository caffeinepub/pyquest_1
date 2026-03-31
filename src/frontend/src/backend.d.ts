import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Level {
    concept: string;
    miniQuiz: Array<Question>;
    title: string;
    xpReward: bigint;
    practiceQuestions: Array<Question>;
    coinReward: bigint;
    levelNumber: bigint;
    stage: string;
}
export interface Badge {
    dateEarned: bigint;
    badgeType: BadgeType;
    name: string;
    description: string;
}
export interface Question {
    explanation: string;
    correctAnswer: string;
    questionText: string;
    questionType: QuestionType;
    wrongExplanations: Array<string>;
    options: Array<string>;
}
export interface Certificate {
    dateEarned: bigint;
    stage: string;
    levelRange: string;
}
export interface UserProfile {
    xp: bigint;
    totalBadges: bigint;
    username: string;
    coins: bigint;
    badges: Array<Badge>;
    streakDays: bigint;
    currentLevel: bigint;
    unlockedLevels: Array<bigint>;
    certificates: Array<Certificate>;
    lastActive: bigint;
    completedLevels: Array<bigint>;
    avatar: bigint;
}
export enum BadgeType {
    streak = "streak",
    quizMaster = "quizMaster",
    stageComplete = "stageComplete",
    levelComplete = "levelComplete"
}
export enum QuestionType {
    mcq = "mcq",
    outputPredict = "outputPredict",
    debugging = "debugging",
    fillBlank = "fillBlank"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    awardBadge(user: Principal, badge: Badge): Promise<void>;
    checkDailyStreak(): Promise<bigint>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLeaderboard(): Promise<Array<[Principal, UserProfile]>>;
    getLevel(levelNumber: bigint): Promise<Level>;
    getUserBadges(): Promise<Array<Badge>>;
    getUserCertificates(): Promise<Array<Certificate>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordCertificate(user: Principal, certificate: Certificate): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateUserProfile(updatedProfile: UserProfile): Promise<void>;
}
