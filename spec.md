# PyQuest

## Current State
New project. Empty workspace with authorization component selected.

## Requested Changes (Diff)

### Add
- Full gamified Python learning app with levels, XP, coins, badges, streaks, leaderboard
- User auth and persistent progress tracking
- Level system: Beginner (1-10), Intermediate (11-20), Advanced (21-30)
- Each level: concept explanation, mini-game, practice tasks, quiz
- Question types: MCQ, fill-in-blank, drag-drop (simulated), output prediction, debugging
- Explanation for every answer (why correct, why others wrong)
- Game elements: time-based challenges, debugging games, output prediction
- Exam system per stage with multiple question types
- Rewards: XP, coins, badges, unlockable levels, avatars
- Daily streaks, leaderboard, story mode narrative
- Stage certificates (Beginner, Intermediate, Advanced, Final)
- Dashboard: user stats, current level, streak, XP bar, recent badges

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: user profiles with XP, coins, badges, streaks, level progress
2. Backend: question/level data storage and retrieval
3. Backend: leaderboard queries
4. Backend: certificate generation records
5. Frontend: Login/onboarding flow with story intro
6. Frontend: Dashboard with stats, XP bar, streak, badges
7. Frontend: Level map/world selector
8. Frontend: Question engine supporting MCQ, fill-blank, debugging, output-prediction
9. Frontend: Answer explanation modal
10. Frontend: Rewards/celebration animations
11. Frontend: Leaderboard page
12. Frontend: Profile/achievements page
13. Frontend: Certificate view page
