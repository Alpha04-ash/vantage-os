export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type SceneType = "intro" | "concept" | "explanation" | "example" | "mistake" | "quiz" | "completion";

export interface Scene {
  id: string;
  type: SceneType;
  title: string;
  subtitle?: string;
  content: string;
  visualType: "image" | "diagram" | "card" | "chart" | "icon" | "mistake-compare";
  visualData?: any;
  points?: string[];
  example?: string;
  mistake?: {
    bad: string;
    good: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  summaryPoints?: string[];
}

export interface Lesson {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  shortDescription: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  theme: string;
  transitionStyle: string;
  scenes: Scene[];
  nextLessonSlug?: string;
}

export interface AcademyProgress {
  currentLessonSlug?: string;
  completedLessons: string[];
  lessonProgress: Record<string, number>; // slug -> lastSceneIndex
  quizAnswers: Record<string, Record<string, { answerIndex: number; isCorrect: boolean }>>; // slug -> sceneId -> data
}
