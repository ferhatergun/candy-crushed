import { initialLevelData } from "@/utils/data";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./secureStore";

interface Level {
  id: number;
  unlocked: boolean;
  completed: boolean;
  highScore: number;
}

interface LevelStorage {
  levels: Level[];
  unlockLevel: (id: number) => void;
  completeLevel: (id: number, score: number) => void;
}

export const useLevelStorage = create<LevelStorage>()(
  persist(
    (set, get) => ({
      levels: initialLevelData,

      unlockLevel: (id: number) => {
        set((state) => {
          const updateLevels = state.levels.map((level) =>
            level.id === id ? { ...level, unlocked: true } : level
          );
          return { levels: updateLevels };
        });
      },
      completeLevel: (id: number, collectedCandies: number) => {
        set((state) => {
          const updatedLevels = state.levels.map((level) => {
            if (level.id === id) {
              return {
                ...level,
                completed: true,
                highScore: Math.max(level.highScore, collectedCandies),
              };
            }
            return level;
          });
          return { levels: updatedLevels };
        });
      },
    }),
    {
      name: "level-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
