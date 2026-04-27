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

type ToolStatus = "idle" | "loading" | "success" | "error";

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

  const runTool = async (toolName: AIToolName) => {
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
          difficulty: "medium" satisfies QuizDifficulty,
          questionCount: 5,
          userId: currentUser.id,
        });
      }

      if (toolName === "Cards") {
        response = await generateFlashcardsWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: "medium" satisfies FlashcardDifficulty,
          cardCount: 8,
          userId: currentUser.id,
        });
      }

      if (toolName === "Tables") {
        response = await generateTablesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: "medium" satisfies TableDifficulty,
          tableType: "concept_comparison" satisfies StudyTableType,
          rowCount: 6,
          userId: currentUser.id,
        });
      }

      if (toolName === "Mind Map") {
        response = await generateMindMapWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: "medium" satisfies MindMapDifficulty,
          branchCount: 6,
          userId: currentUser.id,
        });
      }

      if (toolName === "Slides") {
        response = await generateSlidesWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          difficulty: "medium" satisfies SlidesDifficulty,
          slideCount: 6,
          userId: currentUser.id,
        });
      }

      if (toolName === "Audio") {
        response = await generateAudioOverviewWithN8n({
          topic,
          moduleId,
          selectedSources: selectedSourcePayload,
          style: "podcast" satisfies AudioOverviewStyle,
          length: "standard" satisfies AudioOverviewLength,
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

  return {
    status,
    error,
    result,
    runTool,
    resetTool,
  };
};