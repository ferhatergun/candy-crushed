import useGameLogic from "@/hooks/useGameLogic";
import { screenHeight } from "@/utils/Constants";
import { getCandyImage } from "@/utils/data";
import React from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC,
} from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import { RFPercentage } from "react-native-responsive-fontsize";

interface GameTitleProps {
  data: any[][];
  setData: (data: any) => any;
  setCollectedCandies: (count: any) => any;
}

const GameTitle = ({ data, setCollectedCandies, setData }: GameTitleProps) => {
  const { animatedValues, handleGesture } = useGameLogic({ data, setData });

  return (
    <View style={styles.flex2}>
      {data?.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row?.map((tile, colIndex) => {
            const animatedTile = animatedValues?.[rowIndex]?.[colIndex];

            return (
              <GestureDetector
                key={`${rowIndex}-${colIndex}`}
                gesture={Gesture.Pan()
                  .onStart((e) => {
                    runOnJS(handleGesture)({
                      event: e,
                      rowIndex,
                      colIndex,
                      state: "start",
                      setCollectedCandies,
                    });
                  })
                  .onUpdate((e) => {
                    runOnJS(handleGesture)({
                      event: e,
                      rowIndex,
                      colIndex,
                      state: "active",
                      setCollectedCandies,
                    });
                  })
                  .onEnd((e) => {
                    runOnJS(handleGesture)({
                      event: e,
                      rowIndex,
                      colIndex,
                      state: "end",
                      setCollectedCandies,
                    });
                  })}
              >
                <View
                  style={[
                    styles.tile,
                    tile === null ? styles.emptyTile : styles.activeTile,
                  ]}
                >
                  {tile !== null && animatedTile && (
                    <Animated.Image
                      source={getCandyImage(tile)}
                      style={[
                        styles.candy,
                        {
                          transform: [
                            { translateX: animatedTile.x },
                            { translateY: animatedTile.y },
                          ],
                        },
                      ]}
                      resizeMode="contain"
                    />
                  )}
                </View>
              </GestureDetector>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  flex2: {
    height: screenHeight * 0.75,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    width: RFPercentage(5.5),
    height: RFPercentage(5.5),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  emptyTile: {
    borderColor: "transparent",
  },
  activeTile: {
    borderColor: "#666",
    borderWidth: 0.6,
    backgroundColor: "#326e9a",
  },
  candy: {
    width: "80%",
    height: "80%",
  },
});

export default gestureHandlerRootHOC(GameTitle);
