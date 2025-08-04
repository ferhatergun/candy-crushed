
 const checkForMatches = async (grid: any[][]) => {
   const matches: { row: number; col: number }[] = [];
  // Horizontal matches
   for (let row = 0; row < grid.length; row++) {
     let matchLength = 1;
     for (let col = 1; col < grid[row].length; col++) {
     if (
        grid[row][col] !== null &&
        grid[row][col] === grid[row][col - 1]
      ) {
         matchLength++;
       } else {
         if (matchLength >= 3) {
           for (let i = 0; i < matchLength; i++) {
            matches.push({ row, col: col - 1 - i });
           }
         }
         matchLength = 1;
       }
     }
 
     if (matchLength >= 3) {
       for (let i = 0; i < matchLength; i++) {
         matches.push({ row, col: grid[row].length - 1 - i });
       }
     }
   }
 
  // Vertical matches
   for (let col = 0; col < grid[0].length; col++) {
     let matchLength = 1;
     for (let row = 1; row < grid.length; row++) {
      if (
        grid[row][col] !== null &&
        grid[row][col] === grid[row - 1][col]
      ) {
         matchLength++;
       } else {
         if (matchLength >= 3) {
           for (let i = 0; i < matchLength; i++) {
            matches.push({ row: row - 1 - i, col });
           }
         }
         matchLength = 1;
       }
     }
 
     if (matchLength >= 3) {
       for (let i = 0; i < matchLength; i++) {
         matches.push({ row: grid.length - 1 - i, col });
       }
     }
   }
 
   return matches;
 };
 
 const clearMatches = async (
   grid: any[][],
   matches: { row: number; col: number }[]
 ) => {
   matches?.forEach(({ row, col }) => {
     grid[row][col] = 0;
   });
   return grid;
 };


const shiftDown = async (grid: any[][]) => {
  for (let col = 0; col < grid[0].length; col++) {
    let emptyRow = grid.length - 1;
    for (let row = grid.length - 1; row >= 0; row--) {
      if (grid[row][col] !== null && grid[row][col] !== 0) {
        grid[emptyRow][col] = grid[row][col];
        if (emptyRow !== row) {
          grid[row][col] = 0;
        }
        emptyRow--;
      } else if (grid[row][col] === null) {
        emptyRow = row - 1;
      }
    }
  }

  return grid;
};

const fillRandomCandies = async (grid: any[][]) => {
  const candyTypes = [1, 2, 3, 4, 5]; // Örnek şeker türleri
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === 0) {
        const randomCandy =
          candyTypes[Math.floor(Math.random() * candyTypes.length)];
        grid[row][col] = randomCandy;
      }
    }
  }
  return grid;
};

const hasPossibleMoves = async (grid: any[][]) => {
  const rows = grid.length;
  const cols = grid[0].length;

  const swap = (r1: number, c1: number, r2: number, c2: number) => {
    const temp = grid[r1][c1];
    grid[r1][c1] = grid[r2][c2];
    grid[r2][c2] = temp;
  };

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === null) continue;

      // Sağdaki ile değiştir
      if (col < cols - 1) {
        swap(row, col, row, col + 1);
        const matches = await checkForMatches(grid);
        swap(row, col, row, col + 1); // geri al
        if (matches.length > 0) return true;
      }

      // Alttaki ile değiştir
      if (row < rows - 1) {
        swap(row, col, row + 1, col);
        const matches = await checkForMatches(grid);
        swap(row, col, row + 1, col); // geri al
        if (matches.length > 0) return true;
      }
    }
  }

  return false;
};

const shuffleGrid = (grid: any[][]) => {
    const candies = grid.flat().filter(candy => candy !== null && candy !== 0);
    const rows = grid.length;
    const cols = grid[0].length;

    // Shuffle candies
    for (let i = candies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candies[i], candies[j]] = [candies[j], candies[i]];
    }

    // Fill the grid with shuffled candies
    let index = 0;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (grid[row][col] === null || grid[row][col] === 0) {
          grid[row][col] = candies[index++];
        }
      }
    }

    return grid;
}


const handleShuffleAndClear = async (grid: any[][]) => {
    let newGrid = shuffleGrid(grid);
    let matches = await checkForMatches(newGrid);
    let totalClearedCandies = 0;
    while (matches?.length > 0) {
        totalClearedCandies += matches.length;
        newGrid = await clearMatches(newGrid, matches);
        newGrid = await shiftDown(newGrid);
        newGrid = await fillRandomCandies(newGrid);
        matches = await checkForMatches(newGrid);
    }
    return { grid: newGrid, clearedCandies: totalClearedCandies };
}

export { checkForMatches, clearMatches, fillRandomCandies, handleShuffleAndClear, hasPossibleMoves, shiftDown, shuffleGrid };

