import type { AIToolName, SourceType } from "../components/dashboard/dashboardTypes";
import type {
  AudioOverviewLength,
  QuizDifficulty,
  StudyTableType,
} from "./n8n";

export type AuraToolKey =
  | "quiz"
  | "flashcards"
  | "audio"
  | "slides"
  | "tables"
  | "mindMap";

export type AuraXpEvent =
  | "chat_send"
  | "source_added"
  | "web_search_completed"
  | "web_sources_imported"
  | "ai_tool_generated";

export type AuraStats = {
  username: string;
  level: number;
  xp: number;
  totalXp: number;
  energy: number;
  maxEnergy: number;
  dailyXp: number;
  lastDailyReset: string;
  titles: string[];
  activeTitle: string;
  tools: Record<
    AuraToolKey,
    {
      label: string;
      level: number;
      xp: number;
      totalXp: number;
      dailyXp: number;
    }
  >;
};

export type AwardXpInput = {
  event: AuraXpEvent;
  sourceType?: SourceType;
  toolName?: AIToolName;
  difficulty?: QuizDifficulty;
  audioLength?: AudioOverviewLength;
  tableType?: StudyTableType;
  amountOverride?: number;
};

export type AwardXpResult = {
  nextStats: AuraStats;
  accountXpGained: number;
  toolXpGained: number;
  leveledUp: boolean;
  toolLeveledUp: boolean;
  unlockedTitles: string[];
  message: string;
};

export const AURA_DAILY_XP_CAP = 500;
export const TOOL_DAILY_XP_CAP = 250;
export const MAX_AURA_LEVEL = 50;
export const MAX_TOOL_LEVEL = 20;

export const AURA_LEVEL_TITLES: Record<number, string> = {
  1: "New Learner",
  3: "Focused Student",
  5: "Aura Scholar",
  10: "Knowledge Seeker",
  15: "Study Strategist",
  20: "Master Reviewer",
  30: "Aura Sage",
  40: "Academic Champion",
  50: "Study Aura Legend",
};

export const toolLabels: Record<AuraToolKey, string> = {
  quiz: "Quiz",
  flashcards: "Flashcards",
  audio: "Audio",
  slides: "Slides",
  tables: "Tables",
  mindMap: "Mind Map",
};

export const createDefaultAuraStats = (username = "Student"): AuraStats => {
  const today = new Date().toISOString().slice(0, 10);

  return {
    username,
    level: 1,
    xp: 0,
    totalXp: 0,
    energy: 100,
    maxEnergy: 100,
    dailyXp: 0,
    lastDailyReset: today,
    titles: ["New Learner"],
    activeTitle: "New Learner",
    tools: {
      quiz: createDefaultToolStats("Quiz"),
      flashcards: createDefaultToolStats("Flashcards"),
      audio: createDefaultToolStats("Audio"),
      slides: createDefaultToolStats("Slides"),
      tables: createDefaultToolStats("Tables"),
      mindMap: createDefaultToolStats("Mind Map"),
    },
  };
};

const createDefaultToolStats = (label: string) => ({
  label,
  level: 1,
  xp: 0,
  totalXp: 0,
  dailyXp: 0,
});

export const getXpNeededForLevel = (level: number) => {
  return Math.round(100 + (level - 1) * 75 + Math.pow(level - 1, 1.35) * 35);
};

export const getToolXpNeededForLevel = (level: number) => {
  return Math.round(80 + (level - 1) * 55 + Math.pow(level - 1, 1.25) * 25);
};

export const getToolKeyFromName = (
  toolName?: AIToolName,
): AuraToolKey | null => {
  if (!toolName) return null;

  if (toolName === "Quiz") return "quiz";
  if (toolName === "Cards") return "flashcards";
  if (toolName === "Audio") return "audio";
  if (toolName === "Slides") return "slides";
  if (toolName === "Tables") return "tables";
  if (toolName === "Mind Map") return "mindMap";

  return null;
};

export const getAccountXpForEvent = (input: AwardXpInput) => {
  if (typeof input.amountOverride === "number") return input.amountOverride;

  if (input.event === "chat_send") return 5;
  if (input.event === "web_search_completed") return 10;
  if (input.event === "web_sources_imported") return 15;
  if (input.event === "ai_tool_generated") return 20;

  if (input.event === "source_added") {
    if (input.sourceType === "youtube") return 20;
    if (input.sourceType === "pdf") return 25;
    if (input.sourceType === "image") return 25;
    if (input.sourceType === "website") return 15;
    return 10;
  }

  return 0;
};

export const getToolXpForEvent = (input: AwardXpInput) => {
  if (input.event !== "ai_tool_generated") return 0;

  const toolKey = getToolKeyFromName(input.toolName);
  if (!toolKey) return 0;

  if (toolKey === "audio") {
    if (input.audioLength === "short") return 15;
    if (input.audioLength === "deep") return 40;
    return 25;
  }

  const difficulty = input.difficulty || "medium";

  const easyMediumHard = {
    easy: 0,
    medium: 0,
    hard: 0,
  };

  if (toolKey === "quiz") {
    easyMediumHard.easy = 20;
    easyMediumHard.medium = 35;
    easyMediumHard.hard = 55;
  }

  if (toolKey === "flashcards") {
    easyMediumHard.easy = 15;
    easyMediumHard.medium = 25;
    easyMediumHard.hard = 40;
  }

  if (toolKey === "slides") {
    easyMediumHard.easy = 25;
    easyMediumHard.medium = 40;
    easyMediumHard.hard = 60;
  }

  if (toolKey === "tables") {
    easyMediumHard.easy = 15;
    easyMediumHard.medium = 25;
    easyMediumHard.hard = 40;
  }

  if (toolKey === "mindMap") {
    easyMediumHard.easy = 20;
    easyMediumHard.medium = 35;
    easyMediumHard.hard = 50;
  }

  return easyMediumHard[difficulty];
};

export const resetDailyCapsIfNeeded = (stats: AuraStats): AuraStats => {
  const today = new Date().toISOString().slice(0, 10);

  if (stats.lastDailyReset === today) return stats;

  return {
    ...stats,
    dailyXp: 0,
    lastDailyReset: today,
    energy: stats.maxEnergy,
    tools: Object.fromEntries(
      Object.entries(stats.tools).map(([key, tool]) => [
        key,
        {
          ...tool,
          dailyXp: 0,
        },
      ]),
    ) as AuraStats["tools"],
  };
};

const applyLeveling = ({
  level,
  xp,
  maxLevel,
  getNeeded,
}: {
  level: number;
  xp: number;
  maxLevel: number;
  getNeeded: (level: number) => number;
}) => {
  let nextLevel = level;
  let nextXp = xp;
  let leveledUp = false;

  while (nextLevel < maxLevel && nextXp >= getNeeded(nextLevel)) {
    nextXp -= getNeeded(nextLevel);
    nextLevel += 1;
    leveledUp = true;
  }

  if (nextLevel >= maxLevel) {
    nextLevel = maxLevel;
    nextXp = Math.min(nextXp, getNeeded(maxLevel));
  }

  return {
    level: nextLevel,
    xp: nextXp,
    leveledUp,
  };
};

export const awardAuraXp = (
  currentStats: AuraStats,
  input: AwardXpInput,
): AwardXpResult => {
  const stats = resetDailyCapsIfNeeded(currentStats);
  const accountXpRaw = getAccountXpForEvent(input);
  const accountXpAvailable = Math.max(0, AURA_DAILY_XP_CAP - stats.dailyXp);
  const accountXpGained = Math.min(accountXpRaw, accountXpAvailable);

  let nextStats: AuraStats = {
    ...stats,
    xp: stats.xp + accountXpGained,
    totalXp: stats.totalXp + accountXpGained,
    dailyXp: stats.dailyXp + accountXpGained,
  };

  const accountLevelResult = applyLeveling({
    level: nextStats.level,
    xp: nextStats.xp,
    maxLevel: MAX_AURA_LEVEL,
    getNeeded: getXpNeededForLevel,
  });

  nextStats = {
    ...nextStats,
    level: accountLevelResult.level,
    xp: accountLevelResult.xp,
  };

  const unlockedTitles: string[] = [];

  Object.entries(AURA_LEVEL_TITLES).forEach(([levelValue, title]) => {
    const levelNumber = Number(levelValue);

    if (
      stats.level < levelNumber &&
      nextStats.level >= levelNumber &&
      !nextStats.titles.includes(title)
    ) {
      unlockedTitles.push(title);
    }
  });

  if (unlockedTitles.length > 0) {
    nextStats = {
      ...nextStats,
      titles: [...nextStats.titles, ...unlockedTitles],
      activeTitle: unlockedTitles[unlockedTitles.length - 1],
    };
  }

  const toolKey = getToolKeyFromName(input.toolName);
  let toolXpGained = 0;
  let toolLeveledUp = false;

  if (toolKey) {
    const tool = nextStats.tools[toolKey];
    const toolXpRaw = getToolXpForEvent(input);
    const toolXpAvailable = Math.max(0, TOOL_DAILY_XP_CAP - tool.dailyXp);
    toolXpGained = Math.min(toolXpRaw, toolXpAvailable);

    const toolLevelResult = applyLeveling({
      level: tool.level,
      xp: tool.xp + toolXpGained,
      maxLevel: MAX_TOOL_LEVEL,
      getNeeded: getToolXpNeededForLevel,
    });

    toolLeveledUp = toolLevelResult.leveledUp;

    nextStats = {
      ...nextStats,
      tools: {
        ...nextStats.tools,
        [toolKey]: {
          ...tool,
          xp: toolLevelResult.xp,
          level: toolLevelResult.level,
          totalXp: tool.totalXp + toolXpGained,
          dailyXp: tool.dailyXp + toolXpGained,
        },
      },
    };
  }

  const messageParts = [];

  if (accountXpGained > 0) messageParts.push(`+${accountXpGained} Aura XP`);
  if (toolXpGained > 0) messageParts.push(`+${toolXpGained} Proficiency XP`);

  return {
    nextStats,
    accountXpGained,
    toolXpGained,
    leveledUp: accountLevelResult.leveledUp,
    toolLeveledUp,
    unlockedTitles,
    message: messageParts.join(" • ") || "Daily XP cap reached",
  };
};