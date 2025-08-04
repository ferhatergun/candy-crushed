import { screenHeight } from '@/utils/Constants'
import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, View } from 'react-native'
import ScalePress from '../ui/ScalePress'

const GameFooter = () => {
  return (
    <View style={styles.flex1}>
      <ScalePress onPress={()=>router.back()}>
        <Image source={require('@/assets/icons/close.png')} style={styles.closeIcon}/>
      </ScalePress>
    </View>
  )
}

const styles = StyleSheet.create({
    flex1:{
        height:screenHeight*0.1,
        width:'100%',
        paddingHorizontal:10,
    },
    closeIcon:{
        width:45,
        height:45,
        resizeMode:'contain',
    }
})

export default GameFooter