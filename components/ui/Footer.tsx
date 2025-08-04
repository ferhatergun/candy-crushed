import { FONTS } from '@/utils/Constants'
import React from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'

const Footer = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={()=>Linking.openURL('https://www.linkedin.com/in/ferhatergun/')}>
        <Text style={styles.text}>Made with ❤️ </Text>
        <Text style={styles.text2}>by Ferhat Ergün</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom:20,
        alignSelf: 'center'

    },
    text:{
        fontFamily:FONTS.twinkle,
        fontSize:RFValue(12),
        color: '#fff',
        textAlign: 'center',
        textShadowColor:'rgba(0, 0, 0, 0.75)',
        textShadowOffset:{width: 2, height: 2},
        textShadowRadius:2
    },
        text2:{
        fontFamily:FONTS.twinkle,
        fontSize:RFValue(16),
        color: '#fff',
        textAlign: 'center',
        textShadowColor:'rgba(0, 0, 0, 0.75)',
        textShadowOffset:{width: 2, height: 2},
        textShadowRadius:2
    }
})

export default Footer