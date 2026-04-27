import type {
  GeneratedLesson,
  StudioTool,
} from "../components/dashboard/dashboardTypes";

const now = new Date().toISOString();

export const generatedLessons: GeneratedLesson[] = [
  {
    id: "module-neural-networks",
    title: "Neural Networks",
    subtitle: "Deep learning fundamentals, layers, activation, and training.",
    progress: 68,
    createdAt: now,
    updatedAt: now,
    sources: [
      {
        id: "source-nn-notes",
        title: "Neural Network Class Notes",
        type: "text",
        value:
          "Neural networks are machine learning models inspired by the structure of biological neurons. They use layers of nodes, weights, biases, activation functions, and optimization methods to learn patterns from data.",
        selected: true,
        summary:
          "Covers core neural network ideas: layers, weights, biases, activation functions, forward pass, and training.",
        createdAt: now,
      },
      {
        id: "source-nn-video",
        title: "Intro to Neural Networks Video",
        type: "youtube",
        value: "https://www.youtube.com/watch?v=aircAruvnKk",
        selected: true,
        summary:
          "A visual explanation of how neural networks learn through examples and parameter updates.",
        createdAt: now,
      },
      {
        id: "source-nn-article",
        title: "Backpropagation Article",
        type: "website",
        value: "https://example.com/backpropagation-guide",
        selected: false,
        summary:
          "Explains how backpropagation computes gradients and updates model weights during training.",
        createdAt: now,
      },
    ],
  },
  {
    id: "module-photosynthesis",
    title: "Photosynthesis",
    subtitle: "Light reactions, Calvin cycle, chlorophyll, and glucose production.",
    progress: 42,
    createdAt: now,
    updatedAt: now,
    sources: [
      {
        id: "source-photo-note",
        title: "Photosynthesis Reviewer",
        type: "text",
        value:
          "Photosynthesis is the process where plants convert light energy, carbon dioxide, and water into glucose and oxygen. It happens mainly in chloroplasts.",
        selected: true,
        summary:
          "Summarizes the overall photosynthesis process and main reactants/products.",
        createdAt: now,
      },
    ],
  },
  {
    id: "module-research-methods",
    title: "Research Methods",
    subtitle: "Variables, sampling, methodology, validity, and research design.",
    progress: 24,
    createdAt: now,
    updatedAt: now,
    sources: [],
  },
];

export const studioTools: StudioTool[] = [
  {
    name: "Audio",
    label: "Audio Overview",
    icon: "🎧",
    color: "from-aura-primary to-aura-cyan",
    description: "Generate a podcast-style explanation from selected sources.",
  },
  {
    name: "Slides",
    label: "Slides",
    icon: "🖥️",
    color: "from-aura-cyan to-aura-gold",
    description: "Turn selected context into a presentation outline.",
  },
  {
    name: "Mind Map",
    label: "Mind Map",
    icon: "🧠",
    color: "from-aura-primary to-fuchsia-400",
    description: "Map key ideas and relationships visually.",
  },
  {
    name: "Cards",
    label: "Flashcards",
    icon: "🃏",
    color: "from-aura-gold to-orange-400",
    description: "Create active recall cards from your module.",
  },
  {
    name: "Tables",
    label: "Tables",
    icon: "📊",
    color: "from-emerald-400 to-aura-cyan",
    description: "Compare concepts, terms, steps, or causes and effects.",
  },
  {
    name: "Quiz",
    label: "Quiz",
    icon: "✅",
    color: "from-aura-cyan to-blue-400",
    description: "Generate randomized practice questions.",
  },
];