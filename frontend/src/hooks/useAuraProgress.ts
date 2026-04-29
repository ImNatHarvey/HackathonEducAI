import { useCallback, useEffect, useMemo, useState } from "react";
import {
  awardAuraXp,
  createDefaultAuraStats,
  getToolXpNeededForLevel,
  getUnlockedTitleDefinitions,
  getXpNeededForLevel,
  migrateAuraStats,
  resetDailyCapsIfNeeded,
  setActiveAuraTitle,
  spendAuraEnergy,
  type AuraStats,
  type AwardXpInput,
  type AwardXpResult,
  type SpendEnergyInput,
  type SpendEnergyResult,
} from "../lib/xp";

const STORAGE_KEY_PREFIX = "study-aura-progress";

const getStorageKey = (userId?: string) => {
  return `${STORAGE_KEY_PREFIX}:${userId || "guest"}`;
};

const safelyParseStats = (value: string | null, username: string) => {
  if (!value) return createDefaultAuraStats(username);

  try {
    const parsed = JSON.parse(value) as Partial<AuraStats>;
    return resetDailyCapsIfNeeded(migrateAuraStats(parsed, username));
  } catch {
    return createDefaultAuraStats(username);
  }
};

export const useAuraProgress = ({
  userId,
  username,
}: {
  userId?: string;
  username?: string;
}) => {
  const displayName = username || "Student";
  const storageKey = getStorageKey(userId);

  const [stats, setStats] = useState<AuraStats>(() => {
    if (typeof window === "undefined") {
      return createDefaultAuraStats(displayName);
    }

    return safelyParseStats(localStorage.getItem(storageKey), displayName);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const nextStats = safelyParseStats(
      localStorage.getItem(storageKey),
      displayName,
    );

    setStats({
      ...nextStats,
      username: displayName,
    });
  }, [displayName, storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem(storageKey, JSON.stringify(stats));
  }, [stats, storageKey]);

  const awardXp = useCallback(
    (input: AwardXpInput): AwardXpResult => {
      let result: AwardXpResult;

      setStats((currentStats) => {
        result = awardAuraXp(currentStats, input);
        return result.nextStats;
      });

      return result!;
    },
    [],
  );

  const spendEnergy = useCallback(
    (input: SpendEnergyInput): SpendEnergyResult => {
      let result: SpendEnergyResult;

      setStats((currentStats) => {
        result = spendAuraEnergy(currentStats, input);
        return result.nextStats;
      });

      return result!;
    },
    [],
  );

  const equipTitle = useCallback((title: string) => {
    let wasEquipped = false;

    setStats((currentStats) => {
      const nextStats = setActiveAuraTitle(currentStats, title);
      wasEquipped = nextStats.activeTitle === title;
      return nextStats;
    });

    return wasEquipped;
  }, []);

  const resetProgress = useCallback(() => {
    setStats(createDefaultAuraStats(displayName));
  }, [displayName]);

  const accountProgress = useMemo(() => {
    const needed = getXpNeededForLevel(stats.level);
    const percent = needed > 0 ? Math.min(100, (stats.xp / needed) * 100) : 0;

    return {
      current: stats.xp,
      needed,
      percent,
    };
  }, [stats.level, stats.xp]);

  const toolProgress = useMemo(() => {
    return Object.fromEntries(
      Object.entries(stats.tools).map(([key, tool]) => {
        const needed = getToolXpNeededForLevel(tool.level);
        const percent =
          needed > 0 ? Math.min(100, (tool.xp / needed) * 100) : 0;

        return [
          key,
          {
            current: tool.xp,
            needed,
            percent,
          },
        ];
      }),
    );
  }, [stats.tools]);

  const unlockedTitleDefinitions = useMemo(() => {
    return getUnlockedTitleDefinitions(stats);
  }, [stats]);

  return {
    stats,
    accountProgress,
    toolProgress,
    unlockedTitleDefinitions,
    awardXp,
    spendEnergy,
    equipTitle,
    resetProgress,
  };
};