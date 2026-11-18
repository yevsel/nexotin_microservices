import { View, Text,Dimensions,StatusBar, ImageBackground,TouchableOpacity,StyleSheet } from 'react-native'
import React from 'react'
import AppIntroSlider from 'react-native-app-intro-slider';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as Device from 'expo-device';
// import * as Device from 'expo-device';

const OnboardingScreen = () => {
    // console.log("DEVICE",Device.brand)
    const {height,width} = Dimensions.get("window")
    const navigation = useNavigation()
    
    const slides = [
        {
          key: 1,
          text: 'Your fashion, cosmetics & accessories shop',
          image:require("../assets/onBoarding1.png")
        },
        {
          key: 2,
          text: 'Be immerse in product videos & pictures from verified sellers',
          image:require("../assets/onBoarding2.png")
        },
        {
          key: 3,
          text: 'Buy & get swift delivery to your door step',
          image:require("../assets/onBoarding3.png")
        }
      ];

    return (
      <View style={{width:width,height:height}}>
          <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar>
            <AppIntroSlider
              activeDotStyle={{backgroundColor:COLORS.white,width:30}}
              dotStyle={{backgroundColor:"white"}}
              data={slides}
              // bottomButton={true}
              // showSkipButton={true}
              // dotClickEnabled={true}
              showNextButton={true}
              onDone={()=>{
                // navigation.navigate("IntroScreen")
              }}
              renderNextButton={
                () => {
                  return (
                    <View style={styles.buttonCircle}>
                    {/* <Entypo name="arrow-bold-right" size={24} color="white" /> */}
                    </View>
                  )
                }
              }
              renderDoneButton={()=>{
                return (
                  <View style={styles.buttonCircle}>
                  {/* <FontAwesome name="check" size={24} color="white" /> */}
                  {/* <Entypo name="arrow-bold-right" size={24} color="white" /> */}
                  <Text style={{fontFamily:"PoppinsBold",color:"white",opacity:0.5,marginTop:10}}>Done</Text>
                  
                </View>
                )
              }}
              // renderNextButton={()=>{
              //   return <TouchableOpacity>
              //     <Text style={{fontFamily:"PoppinsBold",color:"white",opacity:0.5}}>Next</Text>
              //   </TouchableOpacity>
              // }}
              // renderSkipButton={()=>{
              //   return <TouchableOpacity>
              //     <Text style={{fontFamily:"PoppinsBold",color:"white",opacity:0.5}}>Skip</Text>
              //   </TouchableOpacity>
              // }}
              renderItem={({item})=>{
                return <ImageBackground source={item.image} style={{width:width,position:"relative",height:height,alignItems:"center",justifyContent:"flex-end"}}>
                  <View style={{height:200,width:width,paddingHorizontal:10}}>
                  <LinearGradient
                      colors={['transparent','rgba(0,0,0,0.85)','rgba(0,0,0,0.95)']}
                      style={{height:400,position:"absolute",bottom:0,left:0,right:0}}
                    />
                    <Text style={{fontFamily:"Mortend",color:"white",fontSize:22,lineHeight:30}}>{item.text}</Text>
                  </View>
              </ImageBackground>
                
              }}
            />
        </View>
  )
}

const styles = StyleSheet.create({
  buttonCircle: {
    // marginBottom:0,
    paddingBottom:20,
    width: "100%",
    height: 50,
    // backgroundColor:"red",
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //[...]
});

export default OnboardingScreen