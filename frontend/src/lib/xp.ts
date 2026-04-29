import type {
  AIToolName,
  SourceType,
} from "../components/dashboard/dashboardTypes";
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

export type TitleCategory =
  | "general"
  | "chat"
  | "source"
  | "web"
  | "quiz"
  | "flashcards"
  | "audio"
  | "slides"
  | "tables"
  | "mindMap"
  | "anime"
  | "gaming"
  | "meme"
  | "legendary";

export type AuraTitleDefinition = {
  id: string;
  title: string;
  icon: string;
  category: TitleCategory;
  requirement: string;
  isUnlocked: (stats: AuraStats) => boolean;
};

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
  activityCounts: {
    chatMessages: number;
    sourcesAdded: number;
    webSourcesImported: number;
    aiOutputsGenerated: number;
  };
  tools: Record<
    AuraToolKey,
    {
      label: string;
      level: number;
      xp: number;
      totalXp: number;
      dailyXp: number;
      generations: number;
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

export type SpendEnergyInput = {
  event: AuraXpEvent;
  sourceType?: SourceType;
  toolName?: AIToolName;
  difficulty?: QuizDifficulty;
  audioLength?: AudioOverviewLength;
  tableType?: StudyTableType;
  amountOverride?: number;
};

export type SpendEnergyResult = {
  nextStats: AuraStats;
  requestedEnergy: number;
  energySpent: number;
  remainingEnergy: number;
  wasLowEnergy: boolean;
  wasDepleted: boolean;
  message: string;
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

export const AURA_DAILY_XP_CAP = 900;
export const TOOL_DAILY_XP_CAP = 500;
export const MAX_AURA_LEVEL = 100;
export const MAX_TOOL_LEVEL = 50;
export const LOW_ENERGY_THRESHOLD = 20;

export const toolLabels: Record<AuraToolKey, string> = {
  quiz: "Quiz",
  flashcards: "Cards",
  audio: "Audio",
  slides: "Slides",
  tables: "Tables",
  mindMap: "Mind Map",
};

const legacyTitleMap: Record<string, string> = {
  "New Learner": "The Protagonist",
  "Fresh Spawn": "The Protagonist",
  "Focused Student": "Aura Farmer",
  "Aura Scholar": "Lore Keeper",
  "Knowledge Seeker": "Wisdom Seeker",
  "Study Strategist": "Tactician",
  "Master Reviewer": "Review Demon",
  "Aura Sage": "Grandmaster",
  "Academic Champion": "Ranked Scholar",
  "Study Aura Legend": "Mythic Grinder",
};

const createDefaultToolStats = (label: string) => ({
  label,
  level: 1,
  xp: 0,
  totalXp: 0,
  dailyXp: 0,
  generations: 0,
});

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
    titles: ["The Protagonist"],
    activeTitle: "The Protagonist",
    activityCounts: {
      chatMessages: 0,
      sourcesAdded: 0,
      webSourcesImported: 0,
      aiOutputsGenerated: 0,
    },
    tools: {
      quiz: createDefaultToolStats("Quiz"),
      flashcards: createDefaultToolStats("Cards"),
      audio: createDefaultToolStats("Audio"),
      slides: createDefaultToolStats("Slides"),
      tables: createDefaultToolStats("Tables"),
      mindMap: createDefaultToolStats("Mind Map"),
    },
  };
};

const mapLegacyTitle = (title: string) => legacyTitleMap[title] ?? title;

export const migrateAuraStats = (
  stats: Partial<AuraStats>,
  username = "Student",
): AuraStats => {
  const defaults = createDefaultAuraStats(username);

  const migratedTitles =
    Array.isArray(stats.titles) && stats.titles.length > 0
      ? Array.from(new Set(stats.titles.map(mapLegacyTitle)))
      : defaults.titles;

  const migratedActiveTitle = mapLegacyTitle(
    stats.activeTitle || defaults.activeTitle,
  );

  const nextStats: AuraStats = {
    ...defaults,
    ...stats,
    username: stats.username || username,
    titles: migratedTitles,
    activeTitle: migratedActiveTitle,
    activityCounts: {
      ...defaults.activityCounts,
      ...(stats.activityCounts ?? {}),
    },
    tools: {
      quiz: {
        ...defaults.tools.quiz,
        ...(stats.tools?.quiz ?? {}),
        label: "Quiz",
        generations: stats.tools?.quiz?.generations ?? 0,
      },
      flashcards: {
        ...defaults.tools.flashcards,
        ...(stats.tools?.flashcards ?? {}),
        label: "Cards",
        generations: stats.tools?.flashcards?.generations ?? 0,
      },
      audio: {
        ...defaults.tools.audio,
        ...(stats.tools?.audio ?? {}),
        label: "Audio",
        generations: stats.tools?.audio?.generations ?? 0,
      },
      slides: {
        ...defaults.tools.slides,
        ...(stats.tools?.slides ?? {}),
        label: "Slides",
        generations: stats.tools?.slides?.generations ?? 0,
      },
      tables: {
        ...defaults.tools.tables,
        ...(stats.tools?.tables ?? {}),
        label: "Tables",
        generations: stats.tools?.tables?.generations ?? 0,
      },
      mindMap: {
        ...defaults.tools.mindMap,
        ...(stats.tools?.mindMap ?? {}),
        label: "Mind Map",
        generations: stats.tools?.mindMap?.generations ?? 0,
      },
    },
  };

  if (!nextStats.titles.includes(nextStats.activeTitle)) {
    nextStats.activeTitle = nextStats.titles[0] ?? "The Protagonist";
  }

  return nextStats;
};

export const getXpNeededForLevel = (level: number) => {
  return 100 + Math.max(0, level - 1) * 25;
};

export const getToolXpNeededForLevel = (level: number) => {
  return 75 + Math.max(0, level - 1) * 20;
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

  if (input.event === "chat_send") return 8;
  if (input.event === "web_search_completed") return 15;
  if (input.event === "web_sources_imported") return 25;
  if (input.event === "ai_tool_generated") return 35;

  if (input.event === "source_added") {
    if (input.sourceType === "youtube") return 30;
    if (input.sourceType === "pdf") return 35;
    if (input.sourceType === "image") return 35;
    if (input.sourceType === "website") return 25;
    return 20;
  }

  return 0;
};

export const getToolXpForEvent = (input: AwardXpInput) => {
  if (input.event !== "ai_tool_generated") return 0;

  const toolKey = getToolKeyFromName(input.toolName);
  if (!toolKey) return 0;

  if (toolKey === "audio") {
    if (input.audioLength === "short") return 25;
    if (input.audioLength === "deep") return 60;
    return 40;
  }

  const difficulty = input.difficulty || "medium";

  if (toolKey === "quiz") {
    if (difficulty === "easy") return 35;
    if (difficulty === "hard") return 80;
    return 55;
  }

  if (toolKey === "flashcards") {
    if (difficulty === "easy") return 30;
    if (difficulty === "hard") return 65;
    return 45;
  }

  if (toolKey === "slides") {
    if (difficulty === "easy") return 40;
    if (difficulty === "hard") return 90;
    return 65;
  }

  if (toolKey === "tables") {
    if (difficulty === "easy") return 30;
    if (difficulty === "hard") return 65;
    return 45;
  }

  if (toolKey === "mindMap") {
    if (difficulty === "easy") return 35;
    if (difficulty === "hard") return 80;
    return 55;
  }

  return 0;
};

export const getEnergyCostForEvent = (input: SpendEnergyInput) => {
  if (typeof input.amountOverride === "number") return input.amountOverride;

  if (input.event === "chat_send") return 1;
  if (input.event === "web_search_completed") return 3;
  if (input.event === "web_sources_imported") return 4;

  if (input.event === "source_added") {
    if (input.sourceType === "youtube") return 6;
    if (input.sourceType === "pdf") return 8;
    if (input.sourceType === "image") return 8;
    if (input.sourceType === "website") return 4;
    return 2;
  }

  if (input.event === "ai_tool_generated") {
    const toolKey = getToolKeyFromName(input.toolName);

    if (toolKey === "slides") {
      if (input.difficulty === "easy") return 12;
      if (input.difficulty === "hard") return 25;
      return 18;
    }

    if (toolKey === "flashcards" || toolKey === "tables") {
      if (input.difficulty === "easy") return 6;
      if (input.difficulty === "hard") return 15;
      return 10;
    }

    if (toolKey === "audio") {
      if (input.audioLength === "short") return 8;
      if (input.audioLength === "deep") return 18;
      return 12;
    }

    if (input.difficulty === "easy") return 8;
    if (input.difficulty === "hard") return 18;
    return 12;
  }

  return 0;
};

export const AURA_TITLE_DEFINITIONS: AuraTitleDefinition[] = [
  {
    id: "the-protagonist",
    title: "The Protagonist",
    icon: "🌱",
    category: "general",
    requirement: "Start your Study Aura journey.",
    isUnlocked: () => true,
  },
  {
    id: "aura-farmer",
    title: "The Drifter",
    icon: "🌾",
    category: "meme",
    requirement: "Reach Aura Level 3.",
    isUnlocked: (stats) => stats.level >= 3,
  },
  {
    id: "ranked-scholar",
    title: "The Professional",
    icon: "🏅",
    category: "gaming",
    requirement: "Reach Aura Level 5.",
    isUnlocked: (stats) => stats.level >= 5,
  },
  {
    id: "lore-keeper",
    title: "The Fullmetal Alchemist",
    icon: "📜",
    category: "gaming",
    requirement: "Reach Aura Level 8.",
    isUnlocked: (stats) => stats.level >= 8,
  },
  {
    id: "wisdom-seeker",
    title: "The Winter Soldier",
    icon: "🧭",
    category: "anime",
    requirement: "Reach Aura Level 10.",
    isUnlocked: (stats) => stats.level >= 10,
  },
  {
    id: "tactician",
    title: "Heisenberg",
    icon: "♟️",
    category: "gaming",
    requirement: "Reach Aura Level 12.",
    isUnlocked: (stats) => stats.level >= 12,
  },
  {
    id: "review-demon",
    title: "The Ghost of the Uchiha",
    icon: "👹",
    category: "anime",
    requirement: "Reach Aura Level 15.",
    isUnlocked: (stats) => stats.level >= 15,
  },
  {
    id: "grindset-awakened",
    title: "The Chosen One",
    icon: "🔥",
    category: "meme",
    requirement: "Reach Aura Level 18.",
    isUnlocked: (stats) => stats.level >= 18,
  },
  {
    id: "grandmaster",
    title: "Shadow Monarch",
    icon: "👑",
    category: "gaming",
    requirement: "Reach Aura Level 25.",
    isUnlocked: (stats) => stats.level >= 25,
  },
  {
    id: "diamond-mindset",
    title: "The King of Heroes",
    icon: "💎",
    category: "gaming",
    requirement: "Reach Aura Level 35.",
    isUnlocked: (stats) => stats.level >= 35,
  },
  {
    id: "mythic-grinder",
    title: "The Baba Yaga",
    icon: "🌌",
    category: "gaming",
    requirement: "Reach Aura Level 45.",
    isUnlocked: (stats) => stats.level >= 45,
  },
  {
    id: "tenno-scholar",
    title: "The Second Dream",
    icon: "⚔️",
    category: "gaming",
    requirement: "Reach Aura Level 55.",
    isUnlocked: (stats) => stats.level >= 55,
  },
  {
    id: "void-farmer",
    title: "Architect of the New World",
    icon: "🌀",
    category: "gaming",
    requirement: "Reach Aura Level 65.",
    isUnlocked: (stats) => stats.level >= 65,
  },
  {
    id: "final-boss",
    title: "The Emperor of Mankind",
    icon: "👾",
    category: "gaming",
    requirement: "Reach Aura Level 75.",
    isUnlocked: (stats) => stats.level >= 75,
  },
  {
    id: "the-honored-one",
    title: "The Honored One",
    icon: "🔵",
    category: "anime",
    requirement: "Reach Aura Level 90.",
    isUnlocked: (stats) => stats.level >= 90,
  },
  {
    id: "limitless-learner",
    title: "The Truth",
    icon: "♾️",
    category: "legendary",
    requirement: "Reach Aura Level 100.",
    isUnlocked: (stats) => stats.level >= 100,
  },
  {
    id: "the-rizzler",
    title: "The Rizzler",
    icon: "💬",
    category: "meme",
    requirement: "Send 10 chat prompts.",
    isUnlocked: (stats) => stats.activityCounts.chatMessages >= 10,
  },
  {
    id: "prompt-sorcerer",
    title: "Wizard King",
    icon: "🪄",
    category: "chat",
    requirement: "Send 25 chat prompts.",
    isUnlocked: (stats) => stats.activityCounts.chatMessages >= 25,
  },
  {
    id: "dialogue-domain",
    title: "Domain Expansion",
    icon: "🗣️",
    category: "anime",
    requirement: "Send 50 chat prompts.",
    isUnlocked: (stats) => stats.activityCounts.chatMessages >= 50,
  },
  {
    id: "main-character-energy",
    title: "He Who Stands Above All",
    icon: "🎬",
    category: "meme",
    requirement: "Send 100 chat prompts.",
    isUnlocked: (stats) => stats.activityCounts.chatMessages >= 100,
  },
  {
    id: "the-source",
    title: "Librarian of Babel",
    icon: "🌐",
    category: "source",
    requirement: "Add 5 sources.",
    isUnlocked: (stats) => stats.activityCounts.sourcesAdded >= 5,
  },
  {
    id: "source-hunter",
    title: "Source Hunter",
    icon: "🕵️",
    category: "source",
    requirement: "Add 15 sources.",
    isUnlocked: (stats) => stats.activityCounts.sourcesAdded >= 15,
  },
  {
    id: "archive-beast",
    title: "The Archivist",
    icon: "🗃️",
    category: "source",
    requirement: "Add 30 sources.",
    isUnlocked: (stats) => stats.activityCounts.sourcesAdded >= 30,
  },
  {
    id: "librarian-of-babel",
    title: "Keeper of the Akashic Records",
    icon: "🏛️",
    category: "source",
    requirement: "Add 60 sources.",
    isUnlocked: (stats) => stats.activityCounts.sourcesAdded >= 60,
  },
  {
    id: "web-drifter",
    title: "The Matrix Glitch",
    icon: "🕸️",
    category: "web",
    requirement: "Import 3 web sources.",
    isUnlocked: (stats) => stats.activityCounts.webSourcesImported >= 3,
  },
  {
    id: "search-engine-sage",
    title: "Search Engine Sage",
    icon: "🔎",
    category: "web",
    requirement: "Import 10 web sources.",
    isUnlocked: (stats) => stats.activityCounts.webSourcesImported >= 10,
  },
  {
    id: "google-fu-grandmaster",
    title: "He Who Walks the Path of Heaven",
    icon: "🥋",
    category: "web",
    requirement: "Import 25 web sources.",
    isUnlocked: (stats) => stats.activityCounts.webSourcesImported >= 25,
  },
  {
    id: "quiz-master",
    title: "The Game Master",
    icon: "⚡",
    category: "quiz",
    requirement: "Reach Quiz Level 3.",
    isUnlocked: (stats) => stats.tools.quiz.level >= 3,
  },
  {
    id: "quiz-expert",
    title: "The Ultimate Despair",
    icon: "🧪",
    category: "quiz",
    requirement: "Reach Quiz Level 8.",
    isUnlocked: (stats) => stats.tools.quiz.level >= 8,
  },
  {
    id: "question-bank-overlord",
    title: "Overlord",
    icon: "🧠",
    category: "quiz",
    requirement: "Generate 25 quizzes.",
    isUnlocked: (stats) => stats.tools.quiz.generations >= 25,
  },
  {
    id: "card-slinger",
    title: "The Gambit",
    icon: "🃏",
    category: "flashcards",
    requirement: "Reach Cards Level 3.",
    isUnlocked: (stats) => stats.tools.flashcards.level >= 3,
  },
  {
    id: "memory-palace-owner",
    title: "Magician",
    icon: "🏰",
    category: "flashcards",
    requirement: "Reach Cards Level 8.",
    isUnlocked: (stats) => stats.tools.flashcards.level >= 8,
  },
  {
    id: "anki-avenger",
    title: "The Joker",
    icon: "🛡️",
    category: "flashcards",
    requirement: "Generate 25 card sets.",
    isUnlocked: (stats) => stats.tools.flashcards.generations >= 25,
  },
  {
    id: "slide-alchemist",
    title: "Daywalker",
    icon: "📊",
    category: "slides",
    requirement: "Reach Slides Level 3.",
    isUnlocked: (stats) => stats.tools.slides.level >= 3,
  },
  {
    id: "deck-builder",
    title: "Peerless",
    icon: "🧱",
    category: "slides",
    requirement: "Generate 10 slide decks.",
    isUnlocked: (stats) => stats.tools.slides.generations >= 10,
  },
  {
    id: "presentation-sensei",
    title: "Untamed",
    icon: "🎤",
    category: "slides",
    requirement: "Generate 25 slide decks.",
    isUnlocked: (stats) => stats.tools.slides.generations >= 25,
  },
  {
    id: "table-tactician",
    title: "True Shogun",
    icon: "📋",
    category: "tables",
    requirement: "Reach Tables Level 3.",
    isUnlocked: (stats) => stats.tools.tables.level >= 3,
  },
  {
    id: "spreadsheet-samurai",
    title: "Spreadsheet Samurai",
    icon: "🗡️",
    category: "tables",
    requirement: "Reach Tables Level 8.",
    isUnlocked: (stats) => stats.tools.tables.level >= 8,
  },
  {
    id: "data-grandmaster",
    title: "Data Grandmaster",
    icon: "📈",
    category: "tables",
    requirement: "Generate 25 tables.",
    isUnlocked: (stats) => stats.tools.tables.generations >= 25,
  },
  {
    id: "mind-map-monk",
    title: "Mind Monk",
    icon: "🧘",
    category: "mindMap",
    requirement: "Reach Mind Map Level 3.",
    isUnlocked: (stats) => stats.tools.mindMap.level >= 3,
  },
  {
    id: "idea-domain-expansion",
    title: "Domain Expansion",
    icon: "🌀",
    category: "anime",
    requirement: "Generate 15 mind maps.",
    isUnlocked: (stats) => stats.tools.mindMap.generations >= 15,
  },
  {
    id: "cosmic-brain-web",
    title: "Perfect Human",
    icon: "🪐",
    category: "mindMap",
    requirement: "Generate 30 mind maps.",
    isUnlocked: (stats) => stats.tools.mindMap.generations >= 30,
  },
  {
    id: "audio-oracle",
    title: "Bohemian Rhapsody",
    icon: "🎧",
    category: "audio",
    requirement: "Reach Audio Level 3.",
    isUnlocked: (stats) => stats.tools.audio.level >= 3,
  },
  {
    id: "podcast-prophet",
    title: "Soul King",
    icon: "🎙️",
    category: "audio",
    requirement: "Generate 15 audio overviews.",
    isUnlocked: (stats) => stats.tools.audio.generations >= 15,
  },
  {
    id: "radio-demon",
    title: "Phantom of the Opera",
    icon: "📻",
    category: "audio",
    requirement: "Generate 30 audio overviews.",
    isUnlocked: (stats) => stats.tools.audio.generations >= 30,
  },
  {
    id: "ai-studio-addict",
    title: "The Fool",
    icon: "🤖",
    category: "general",
    requirement: "Generate 20 AI Studio outputs.",
    isUnlocked: (stats) => stats.activityCounts.aiOutputsGenerated >= 20,
  },
  {
    id: "factory-reset-brain",
    title: "The Masterpiece",
    icon: "🧼",
    category: "meme",
    requirement: "Generate 50 AI Studio outputs.",
    isUnlocked: (stats) => stats.activityCounts.aiOutputsGenerated >= 50,
  },
  {
    id: "the-grinder",
    title: "The Monster",
    icon: "🔥",
    category: "meme",
    requirement: "Earn 1,000 total Aura XP.",
    isUnlocked: (stats) => stats.totalXp >= 1000,
  },
  {
    id: "no-sleep-scholar",
    title: "Flaw of the World",
    icon: "🌙",
    category: "meme",
    requirement: "Earn 3,000 total Aura XP.",
    isUnlocked: (stats) => stats.totalXp >= 3000,
  },
  {
    id: "xp-millionaire",
    title: "Great Love Immortal Venerable",
    icon: "💰",
    category: "legendary",
    requirement: "Earn 7,500 total Aura XP.",
    isUnlocked: (stats) => stats.totalXp >= 7500,
  },
  {
    id: "aura-billionaire",
    title: "The One Above All",
    icon: "🤑",
    category: "legendary",
    requirement: "Earn 15,000 total Aura XP.",
    isUnlocked: (stats) => stats.totalXp >= 15000,
  },
];

export const getUnlockedTitleDefinitions = (stats: AuraStats) => {
  return AURA_TITLE_DEFINITIONS.filter((definition) =>
    definition.isUnlocked(stats),
  );
};

export const getUnlockedTitleNames = (stats: AuraStats) => {
  return getUnlockedTitleDefinitions(stats).map((definition) => definition.title);
};

export const unlockEligibleTitles = (stats: AuraStats) => {
  const unlockedTitleNames = getUnlockedTitleNames(stats);
  const currentTitleSet = new Set(stats.titles);
  const newlyUnlockedTitles = unlockedTitleNames.filter(
    (title) => !currentTitleSet.has(title),
  );

  if (newlyUnlockedTitles.length === 0) {
    return {
      nextStats: stats,
      newlyUnlockedTitles,
    };
  }

  return {
    nextStats: {
      ...stats,
      titles: [...stats.titles, ...newlyUnlockedTitles],
      activeTitle: newlyUnlockedTitles[newlyUnlockedTitles.length - 1],
    },
    newlyUnlockedTitles,
  };
};

export const setActiveAuraTitle = (
  currentStats: AuraStats,
  title: string,
): AuraStats => {
  const stats = migrateAuraStats(currentStats, currentStats.username);

  if (!stats.titles.includes(title)) return stats;

  return {
    ...stats,
    activeTitle: title,
  };
};

export const resetDailyCapsIfNeeded = (currentStats: AuraStats): AuraStats => {
  const stats = migrateAuraStats(currentStats, currentStats.username);
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

export const spendAuraEnergy = (
  currentStats: AuraStats,
  input: SpendEnergyInput,
): SpendEnergyResult => {
  const stats = resetDailyCapsIfNeeded(currentStats);
  const requestedEnergy = Math.max(0, getEnergyCostForEvent(input));
  const energySpent = Math.min(stats.energy, requestedEnergy);
  const remainingEnergy = Math.max(0, stats.energy - requestedEnergy);

  const nextStats: AuraStats = {
    ...stats,
    energy: remainingEnergy,
  };

  const wasDepleted = remainingEnergy <= 0;
  const wasLowEnergy =
    remainingEnergy > 0 && remainingEnergy <= LOW_ENERGY_THRESHOLD;

  return {
    nextStats,
    requestedEnergy,
    energySpent,
    remainingEnergy,
    wasLowEnergy,
    wasDepleted,
    message:
      requestedEnergy === 0
        ? "No energy spent"
        : `-${energySpent} Energy${
            energySpent < requestedEnergy ? ` (${requestedEnergy} requested)` : ""
          }`,
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
    activityCounts: {
      ...stats.activityCounts,
      chatMessages:
        stats.activityCounts.chatMessages +
        (input.event === "chat_send" ? 1 : 0),
      sourcesAdded:
        stats.activityCounts.sourcesAdded +
        (input.event === "source_added" ? 1 : 0),
      webSourcesImported:
        stats.activityCounts.webSourcesImported +
        (input.event === "web_sources_imported" ? 1 : 0),
      aiOutputsGenerated:
        stats.activityCounts.aiOutputsGenerated +
        (input.event === "ai_tool_generated" ? 1 : 0),
    },
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
          generations:
            tool.generations + (input.event === "ai_tool_generated" ? 1 : 0),
        },
      },
    };
  }

  const titleUnlockResult = unlockEligibleTitles(nextStats);
  nextStats = titleUnlockResult.nextStats;

  const messageParts = [];

  if (accountXpGained > 0) messageParts.push(`+${accountXpGained} Aura XP`);
  if (toolXpGained > 0) messageParts.push(`+${toolXpGained} Proficiency XP`);

  return {
    nextStats,
    accountXpGained,
    toolXpGained,
    leveledUp: accountLevelResult.leveledUp,
    toolLeveledUp,
    unlockedTitles: titleUnlockResult.newlyUnlockedTitles,
    message: messageParts.join(" • ") || "Daily XP cap reached",
  };
};