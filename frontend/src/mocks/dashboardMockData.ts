import type {
  StudyModule,
  StudioTool,
} from "../components/dashboard/dashboardTypes";

export const generatedLessons: StudyModule[] = [];

export const studioTools: StudioTool[] = [
  {
    name: "Audio",
    label: "Listen",
    icon: "🎧",
    color:
      "from-aura-cyan/25 to-aura-blue/10 border-aura-cyan/30 hover:text-aura-cyan",
    description: "Text to speech overview",
  },
  {
    name: "Slides",
    label: "Present",
    icon: "🖥️",
    color:
      "from-aura-primary/25 to-aura-primary-soft/10 border-aura-primary-soft/30 hover:text-aura-primary-soft",
    description: "Generate presentation",
  },
  {
    name: "Mind Map",
    label: "Connect",
    icon: "🧠",
    color:
      "from-aura-pink/25 to-aura-primary/10 border-aura-pink/30 hover:text-aura-pink",
    description: "Visual concept map",
  },
  {
    name: "Cards",
    label: "Review",
    icon: "🃏",
    color:
      "from-aura-green/25 to-aura-cyan/10 border-aura-green/30 hover:text-aura-green",
    description: "Flashcards",
  },
  {
    name: "Tables",
    label: "Organize",
    icon: "📊",
    color:
      "from-aura-orange/25 to-aura-gold/10 border-aura-orange/30 hover:text-aura-orange",
    description: "Illustration tables",
  },
  {
    name: "Quiz",
    label: "Test",
    icon: "⚡",
    color:
      "from-aura-gold/25 to-aura-orange/10 border-aura-gold/30 hover:text-aura-gold",
    description: "Practice questions",
  },
];