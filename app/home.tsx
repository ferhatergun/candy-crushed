import Footer from '@/components/ui/Footer'
import ScalePress from '@/components/ui/ScalePress'
import { commonStyles } from '@/styles/commonStyles'
import { screenHeight, screenWidth } from '@/utils/Constants'
import { useSound } from '@/utils/SoundContext'
import { useFocusEffect, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { useCallback } from 'react'
import { Image, ImageBackground, StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'


const HomeScreen = () => {
  const router = useRouter()
  const {playSound} = useSound()
  const translateY = useSharedValue(-200)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }]
  }))

  useFocusEffect(
    useCallback(() => {
      translateY.value = withTiming(0, { duration: 3000 })
      playSound('bg', true)
    }, [])
  )

  return (
    <ImageBackground source={require('@/assets/images/b2.png')} style={commonStyles.container}>
      <Animated.Image
        source={require('@/assets/images/banner.png')}
        style={[styles.img, animatedStyle]}
      />

      <LottieView 
      source={require('@/assets/animations/bird.json')}
      speed={1}
      loop
      autoPlay
      hardwareAccelerationAndroid
      style={styles.lottieView}
      />

      <ScalePress style={styles.playButtonContainer} onPress={()=>router.push( '/level')}>
        <Image 
        source={require('@/assets/icons/play.png')}
        style={styles.playButton}
        />
      </ScalePress>

      <Footer />
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  img: {
    width: screenWidth,
    height: screenWidth * 0.8,
    position: 'absolute',
    resizeMode: 'contain',
    top: -20,
  },
  lottieView:{
    width:200,
    height:200,
    position: 'absolute',
    left:-20,
    top:'30%',
    transform: [{ scaleX: -1 }]
  },
  playButton: {
    resizeMode: 'contain',
    width: screenWidth * 0.5,
    height: screenHeight * 0.2,
  },playButtonContainer: {
    marginTop:screenHeight * 0.35,
  }
})

export default HomeScreen
