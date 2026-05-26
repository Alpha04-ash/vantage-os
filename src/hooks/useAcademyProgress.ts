"use client";

import { useState, useEffect } from "react";
import { AcademyProgress } from "@/types/academy";

const STORAGE_KEY = "vantage_academy_v5_progress";

const defaultProgress: AcademyProgress = {
  completedLessons: [],
  lessonProgress: {},
  quizAnswers: {},
};

export function useAcademyProgress() {
  const [progress, setProgress] = useState<AcademyProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse academy progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = (newProgress: AcademyProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const startLesson = (slug: string) => {
    if (!progress.lessonProgress[slug]) {
      const newProgress = {
        ...progress,
        currentLessonSlug: slug,
        lessonProgress: { ...progress.lessonProgress, [slug]: 0 },
      };
      saveProgress(newProgress);
    }
  };

  const setSceneIndex = (slug: string, index: number) => {
    const newProgress = {
      ...progress,
      lessonProgress: { ...progress.lessonProgress, [slug]: index },
    };
    saveProgress(newProgress);
  };

  const completeLesson = (slug: string) => {
    if (!progress.completedLessons.includes(slug)) {
      const newProgress = {
        ...progress,
        completedLessons: [...progress.completedLessons, slug],
      };
      saveProgress(newProgress);
    }
  };

  const saveQuizAnswer = (slug: string, sceneId: string, answerIndex: number, isCorrect: boolean) => {
    const newProgress = {
      ...progress,
      quizAnswers: {
        ...progress.quizAnswers,
        [slug]: {
          ...(progress.quizAnswers[slug] || {}),
          [sceneId]: { answerIndex, isCorrect },
        },
      },
    };
    saveProgress(newProgress);
  };

  const resetLessonProgress = (slug: string) => {
    const newProgress = {
      ...progress,
      lessonProgress: { ...progress.lessonProgress, [slug]: 0 },
    };
    saveProgress(newProgress);
  };

  const resetProgress = () => {
    saveProgress(defaultProgress);
  };

  return {
    progress,
    isLoaded,
    startLesson,
    setSceneIndex,
    completeLesson,
    saveQuizAnswer,
    resetLessonProgress,
    resetProgress,
  };
}
