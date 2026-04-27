import { useState } from "react";
import {
  generateAudioOverviewWithN8n,
  generateFlashcardsWithN8n,
  generateMindMapWithN8n,
  generateQuizWithN8n,
  generateSlidesWithN8n,
  generateTablesWithN8n,
  type AudioOverviewLength,
  type AudioOverviewStyle,
  type FlashcardDifficulty,
  type MindMapDifficulty,
  type QuizDifficulty,
  type SlidesDifficulty,
  type StudyTableType,
  type TableDifficulty,
} from "../lib/n8n";
import { currentUser } from "../components/user/userMock";
import type {
  AIToolName,
  StudySource,
} from "../components/dashboard/dashboardTypes";

type UseAIToolActionsParams = {
  topic: string;
  moduleId?: string;
  selectedSources: StudySource[];
};

export type AIToolGenerationOptions = {
  difficulty: QuizDifficulty;
  tableType: StudyTableType;
  audioStyle: AudioOverviewStyle;
  audioLength: AudioOverviewLength;
};

type ToolStatus = "idle" | "loading" | "success" | "error";

const generationDefaults = {
  quiz: {
    easy: 10,
    medium: 20,
    hard: 30,
  },
  flashcards: {
    easy: 10,
    medium: 15,
    hard: 20,
  },
  tables: {
    easy: 5,
    medium: 8,
    hard: 10,
  },
  mindMap: {
    easy: 4,
    medium: 6,
    hard: 8,
  },
  slides: {
    easy: 5,
    medium: 8,
    hard: 10,
  },
} as const;

export const useAIToolActions = ({
  topic,
  moduleId,
  selectedSources,
}: UseAIToolActionsParams) => {
  const [status, setStatus] = useState<ToolStatus>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const selectedSourcePayload = selectedSources.map((source) => ({
    id: source.id,
    title: source.title,
    type: source.type,
    value: source.value,
    summary: source.summary,
  }));

  const runTool = async (
    toolName: AIToolName,
    options: AIToolGenerationOptions,
  ) => {
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      let response: unknown = null;

      if (toolName === "Quiz") {
        response = await generateQuizWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies QuizDifficulty,
          questionCount: generationDefaults.quiz[options.difficulty],
          userId: currentUser.id,
        });
      }

      if (toolName === "Cards") {
        response = await generateFlashcardsWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies FlashcardDifficulty,
          cardCount: generationDefaults.flashcards[options.difficulty],
          userId: currentUser.id,
        });
      }

      if (toolName === "Tables") {
        response = await generateTablesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies TableDifficulty,
          tableType: options.tableType,
          rowCount: generationDefaults.tables[options.difficulty],
          userId: currentUser.id,
        });
      }

      if (toolName === "Mind Map") {
        response = await generateMindMapWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies MindMapDifficulty,
          branchCount: generationDefaults.mindMap[options.difficulty],
          userId: currentUser.id,
        });
      }

      if (toolName === "Slides") {
        response = await generateSlidesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: options.difficulty satisfies SlidesDifficulty,
          slideCount: generationDefaults.slides[options.difficulty],
          userId: currentUser.id,
        });
      }

      if (toolName === "Audio") {
        response = await generateAudioOverviewWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          style: options.audioStyle,
          length: options.audioLength,
          userId: currentUser.id,
        });
      }

      setResult(response);
      setStatus("success");
    } catch (toolError) {
      setStatus("error");
      setError(
        toolError instanceof Error
          ? toolError.message
          : "Failed to generate AI tool output.",
      );
    }
  };

  const resetTool = () => {
    setStatus("idle");
    setError("");
    setResult(null);
  };

  const getLockedCountLabel = (
    toolName: AIToolName,
    difficulty: QuizDifficulty,
  ) => {
    if (toolName === "Quiz") {
      return `${generationDefaults.quiz[difficulty]} questions`;
    }

    if (toolName === "Cards") {
      return `${generationDefaults.flashcards[difficulty]} cards`;
    }

    if (toolName === "Tables") {
      return `${generationDefaults.tables[difficulty]} rows`;
    }

    if (toolName === "Mind Map") {
      return `${generationDefaults.mindMap[difficulty]} branches`;
    }

    if (toolName === "Slides") {
      return `${generationDefaults.slides[difficulty]} slides`;
    }

    return "Based on audio length";
  };

  return {
    status,
    error,
    result,
    runTool,
    resetTool,
    getLockedCountLabel,
  };
};