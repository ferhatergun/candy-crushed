import { commonStyles } from '@/styles/commonStyles'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, ImageBackground } from 'react-native'
const SplashScreen = () => {
  const router= useRouter()

  useEffect(()=>{
    const timeoutId = setTimeout(() => {
      router.push("/home")
    }, 2500);
    return ()=> clearTimeout(timeoutId)
  },[])
  return (
    <ImageBackground source={require('@/assets/images/bg.png')} style={commonStyles.container}>
     <Image source={require('@/assets/text/logo.png')} style={commonStyles.img} />
    </ImageBackground>
  )
}

export default SplashScreen