import {
  checkForMatches,
  clearMatches,
  fillRandomCandies,
  handleShuffleAndClear,
  hasPossibleMoves,
  shiftDown,
} from "@/utils/gridUtils";
import { playSound } from "@/utils/SoundUtility";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";

interface GameLogic {
  data: any[][];
  setData: (data: any) => any;
}

interface handleGesture {
  event: any;
  rowIndex: number;
  colIndex: number;
  state: "start" | "active" | "end"; // ✅ artık string
  setCollectedCandies: any;
}

interface handleSwipe {
  rowIndex: number;
  colIndex: number;
  direction: "left" | "right" | "up" | "down";
  setCollectedCandies: any;
}

const useGameLogic = ({ data, setData }: GameLogic) => {
  const animatedValues = useRef(
    data?.map((row) =>
      row.map((tile) =>
        tile === null
          ? null
          : { x: new Animated.Value(0), y: new Animated.Value(0) }
      )
    )
  ).current;

 // Clear any existing matches on the board (e.g. at game start)
  useEffect(() => {
    const resolveInitialMatches = async () => {
      if (!data) return;
      let newGrid = JSON.parse(JSON.stringify(data));
      let matches = await checkForMatches(newGrid);
      if (matches.length === 0) return;

      while (matches.length > 0) {
        newGrid = await clearMatches(newGrid, matches);
        newGrid = await shiftDown(newGrid);
        newGrid = await fillRandomCandies(newGrid);
        matches = await checkForMatches(newGrid);
      }

      setData(newGrid);
    };

    resolveInitialMatches();
  }, [data, setData]);


  const handleSwipe = async ({
    colIndex,
    direction,
    rowIndex,
    setCollectedCandies,
  }: handleSwipe) => {
    playSound("candy_shuffle");
    let newGrid = JSON.parse(JSON.stringify(data));
    let targetRow = rowIndex;
    let targetCol = colIndex;

    if (direction === "left") targetCol -= 1;
    else if (direction === "right") targetCol += 1;
    else if (direction === "up") targetRow -= 1;
    else if (direction === "down") targetRow += 1;

    if (
      targetRow >= 0 &&
      targetRow < data.length &&
      targetCol >= 0 &&
      targetCol < data[0].length &&
      data[rowIndex][colIndex] !== null &&
      data[targetRow][targetCol] !== null &&
      animatedValues[rowIndex]?.[colIndex] &&
      animatedValues[targetRow]?.[targetCol]
    ) {
      const tileSize = RFPercentage(5);

      const animations = Animated.parallel([
        Animated.timing(animatedValues[rowIndex][colIndex].x, {
          toValue: (targetCol - colIndex) * tileSize,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[rowIndex][colIndex].y, {
          toValue: (targetRow - rowIndex) * tileSize,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[targetRow][targetCol]!.x, {
          toValue: (colIndex - targetCol) * tileSize,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValues[targetRow][targetCol]!.y, {
          toValue: (rowIndex - targetRow) * tileSize,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);

      animations.start(async () => {
        [newGrid[rowIndex][colIndex], newGrid[targetRow][targetCol]] = [
          newGrid[targetRow][targetCol],
          newGrid[rowIndex][colIndex],
        ];

        let matches = await checkForMatches(newGrid);
        let totalClearedCandies = 0;

 if (!matches || matches.length === 0) {
          [newGrid[rowIndex][colIndex], newGrid[targetRow][targetCol]] = [
            newGrid[targetRow][targetCol],
            newGrid[rowIndex][colIndex],
          ];
          Animated.parallel([
            Animated.timing(animatedValues[rowIndex][colIndex]!.x, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[rowIndex][colIndex]!.y, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[targetRow][targetCol]!.x, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValues[targetRow][targetCol]!.y, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          return;
        }

        // Handle matches and cascades
        while (matches.length > 0) {
          playSound("candy_clear");
          totalClearedCandies += matches.length;
          newGrid = await clearMatches(newGrid, matches);
          newGrid = await shiftDown(newGrid);
          newGrid = await fillRandomCandies(newGrid);
          matches = await checkForMatches(newGrid);
        }

        // Reset animasyon değerleri
        animatedValues[rowIndex][colIndex]!.x.setValue(0);
        animatedValues[rowIndex][colIndex]!.y.setValue(0);
        animatedValues[targetRow][targetCol]!.x.setValue(0);
        animatedValues[targetRow][targetCol]!.y.setValue(0);

        setData(newGrid);

        const hasMoves = await hasPossibleMoves(newGrid);
        if (!hasMoves) {
          const result = await handleShuffleAndClear(newGrid);
          newGrid = result.grid;
          totalClearedCandies += result.clearedCandies;
          while (!(await hasPossibleMoves(newGrid))) {
            const reshuffle = await handleShuffleAndClear(newGrid);
            newGrid = reshuffle.grid;
            totalClearedCandies += reshuffle.clearedCandies;
          }
          setData(newGrid);
        }

setCollectedCandies((prev: number) => prev + totalClearedCandies);      });
    }
  };

  const handleGesture = async ({
    event,
    rowIndex,
    colIndex,
    state,
    setCollectedCandies,
  }: handleGesture) => {
    if (!data?.[rowIndex]?.[colIndex]) return;
    if (data[rowIndex][colIndex] === null) return;

    if (state === "end" && event) {
      const { translationX, translationY } = event;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      const direction =
        absX > absY
          ? translationX > 0
            ? "right"
            : "left"
          : translationY > 0
          ? "down"
          : "up";

      await handleSwipe({
        rowIndex,
        colIndex,
        direction,
        setCollectedCandies,
      });
    }
  };

  return {
    animatedValues,
    handleGesture,
  };
};

export default useGameLogic;
