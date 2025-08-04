import ScalePress from "@/components/ui/ScalePress";
import { useLevelStorage } from "@/storage/useLevelStorage";
import { commonStyles } from "@/styles/commonStyles";
import { levelStyles } from "@/styles/levelStyles";
import { gameLevels } from "@/utils/data";
import { router } from "expo-router";
import React, { FC } from "react";
import { FlatList, Image, ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LevelScreen: FC = () => {
  const { levels } = useLevelStorage();

  const levelPressHandler = (id: string) => {
    const levelKey = `level${id}`;
    const level = gameLevels[levelKey];
    router.push({
      pathname: "/game",
      params: { ...level, id },
    });
  };

  const renderItem = ({ item }: any) => {
    const opacity = item?.unlocked ? 1 : 0.5;
    const emoji = item?.completed ? "✅" : item?.unlocked ? "🍬" : "🔒";
    return (
      <ScalePress
        style={levelStyles.levelItem}
        onPress={() => {
          if (item?.unlocked) {
            levelPressHandler(item?.id);
          }
        }}
      >
        <View style={{ opacity }}>
          <Text style={levelStyles.levelText}>{emoji}</Text>
          <Text style={levelStyles.levelText}>Level {item?.id}</Text>
          {item?.highScore > 0 && (
            <Text style={levelStyles.highScoreText}>HS: {item?.highScore}</Text>
          )}
        </View>
      </ScalePress>
    );
  };

  return (
    <ImageBackground
      style={commonStyles.container}
      source={require("@/assets/images/forest.jpeg")}
    >
      <SafeAreaView>
        <View style={levelStyles.flex1}>
          <ScalePress onPress={() => router.back()} style={{display: 'flex',alignSelf:'flex-start'}}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={levelStyles.backIcon}
            />
          </ScalePress>

          <ImageBackground
            source={require("@/assets/images/lines.jpg")}
            style={levelStyles.subLevelContainer}
          >
            <View style={levelStyles.subLevelContainer}>
              <FlatList
                data={levels}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={levelStyles.columnWrapper}
                ListFooterComponent={
                  <View style={levelStyles.comingSoonContainer}>
                    <Image
                      source={require("@/assets/images/doddle.png")}
                      style={levelStyles.doddle}
                    />
                    <Text style={levelStyles.comingSoonText}>Çok Yakında</Text>
                  </View>
                }
              />
            </View>
          </ImageBackground>

          <View style={levelStyles.flex2}>
            <Text style={levelStyles.text}>Seviye Seçin</Text>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default LevelScreen;
