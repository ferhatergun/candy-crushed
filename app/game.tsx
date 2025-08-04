 import GameFooter from "@/components/game/GameFooter";
import GameHeader from "@/components/game/GameHeader";
import GameTitle from "@/components/game/GameTitle";
import { useSound } from "@/screens/SoundContext";
import { useLevelStorage } from "@/storage/useLevelStorage";
import { commonStyles } from "@/styles/commonStyles";
import { screenWidth } from "@/utils/Constants";
import { gameLevels } from "@/utils/data";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { Alert, Animated, ImageBackground, StyleSheet } from "react-native";
 
 const GameScreen: FC = () => {
   const [totalCount, setTotalCount] = useState<number>(0);
   const [time, setTime] = useState<any>(0);
   const [collectedCandies, setCollectedCandies] = useState<number>(0);
   const [gridData, setGridData] = useState<any>(null);
   const item = useLocalSearchParams<any>();
   const { playSound } = useSound();
 
   const [showAnimation, setShowAnimation] = useState<boolean>(false);
   const [firstAnimation, setFirstAnimation] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
   const { completeLevel, unlockLevel } = useLevelStorage();
 
   const fadeAnimation = useRef(new Animated.Value(1)).current;
   const scaleAnimation = useRef(new Animated.Value(1)).current;
 
   useEffect(() => {
     if (item) {
       const levelKey = `level${item?.id}`;
       const level = gameLevels[levelKey];
       console.log("BBBBB", level.pass);
       setGridData(level.grid);
       setTotalCount(level.pass);
       setTime(level.time);
     }
   }, []);
 
   useEffect(() => {
     if (time === 0 && totalCount !== 0) {
       handleGameOver();
     }
   }, [time, totalCount]);
 
   const handleGameOver = () => {
    if (isGameOver || totalCount === 0) return; // boş veriyle çağırma
    setIsGameOver(true);
 
     console.log("AAAAA", collectedCandies, totalCount);
     if (collectedCandies >= totalCount) {
       completeLevel(item?.id, collectedCandies);
       unlockLevel(item?.id + 1);
       Alert.alert("Tebrikler!", `Seviye ${item?.id} başarıyla tamamlandı!`, [
         {
           text: "Tamam",
           onPress: () => {
             router.back();
           },
         },
       ]);
     } else {
       Alert.alert(
         "Oyun Bitti!",
         `Seviye ${item?.id} tamamlanamadı. Toplam ${collectedCandies} şeker toplandı.`,
         [
           {
             text: "Tekrar Dene",
             onPress: () => {
               router.back();
             },
           },
         ]
       );
     }
   };
 
   useEffect(() => {
     if (time && time > 0) {
       const timer = setInterval(() => {
        setTime((prevTime: number) => (prevTime > 0 ? prevTime - 1000 : 0));
       }, 1000);
 
       return () => clearInterval(timer);
     }
   }, [time]);
 
  useEffect(() => {
    if (collectedCandies >= totalCount && totalCount > 0) {
      setTime(0);
    }
  }, [collectedCandies, totalCount]);

   useEffect(() => {
     if (collectedCandies >= totalCount && totalCount > 0 && !firstAnimation) {
       setShowAnimation(true);
       startHeartBeatAnimation();
     }
   }, [collectedCandies, totalCount]);
 
   const startHeartBeatAnimation = () => {
     playSound("cheer", false);
     Animated.loop(
       Animated.sequence([
         Animated.parallel([
           Animated.timing(fadeAnimation, {
             toValue: 1,
             duration: 800,
             useNativeDriver: true,
           }),
           Animated.timing(scaleAnimation, {
             toValue: 1.2,
             duration: 800,
             useNativeDriver: true,
           }),
         ]),
 
         Animated.parallel([

          Animated.timing(fadeAnimation, {
            toValue: 0.8,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]),
      {
        iterations: 2,
      }
    ).start(() => {
      setShowAnimation(false);
      setFirstAnimation(true);
    });
  };

  return (
    <ImageBackground
      style={commonStyles.simpleContainer}
      source={require("@/assets/images/b1.png")}
    >
      <GameHeader
        totalCount={totalCount}
        collectedCandies={collectedCandies}
        time={time}
      />
      {gridData && (
        <GameTitle
          data={gridData}
          setData={setGridData}
          setCollectedCandies={setCollectedCandies}
        />
      )}

      {showAnimation && (
        <>
          <Animated.Image
            source={require("@/assets/text/t2.png")}
            style={[
              styles.heartBeatImage,
              {
                opacity: fadeAnimation,
                transform: [{ scale: scaleAnimation }],
              },
            ]}
          />
          <LottieView
            source={require("@/assets/animations/confetti_2.json")}
            style={styles.lottie}
            autoPlay
            loop
          />
        </>
      )}
      <GameFooter />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  heartBeatImage: {
    position: "absolute",
    width: screenWidth * 0.8,
    height: 180,
    resizeMode: "contain",
    alignSelf: "center",
    top: "15%",
  },
  lottie: {
    position: "absolute",
    width: screenWidth * 0.8,
    height: 180,
    alignSelf: "center",
    top: "10%",
    resizeMode: "contain",
  },
});

export default GameScreen;
