import { View, Text, Dimensions, StatusBar ,TouchableOpacity} from 'react-native'
import React, { useRef, useEffect, useState } from 'react'
// import { useIsFocused,useRoute } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import EachVideo from '../components/EachVideo';
// import { Entypo } from '@expo/vector-icons';
import TopBasket from '../components/TopBasket';
import * as Device from 'expo-device';
import { useSelector } from 'react-redux';
// import { get } from 'mongoose';
// import { COLORS } from '../constants/theme';
import { router, usePathname } from 'expo-router';


const VideoMainScreen = ({ setLoggedIn,setInVideoScreen,getVideos, videos }) => {


    const path = usePathname()
    const isFocussed = path ==="/Videos"?true:false
    const mediaRefs = useRef([])
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height
    const userAccountObject = useSelector(state=>state.userObjectReducer)
    

    const [currentVideo, setCurrentVideo] = useState()
    const [pauseVideoMain, setPauseVideoMain] = useState(true)
    
    const [loadingPage,setLoadingPage] = useState(true)

    useEffect(() => {

        if (!isFocussed) {
            setPauseVideoMain(true)
            setInVideoScreen(false)
        } else {
            setPauseVideoMain(false)
            setInVideoScreen(true)
        }
        
    }, [isFocussed])
    const onViewableItemsChanged = useRef(({ changed }) => {
        const video = changed[0]
        setCurrentVideo(changed[0])
        if (video.isViewable) {
            // console.log("Video",video.index+1,"is viewable and can play")
            mediaRefs.current.forEach(element => {
                // console.log(element)
                if (element !== null) {  
                    // setPauseVideoMain(true)
                    element.stop()
                }
            })
            mediaRefs.current[video.index].play()
        } else {
            mediaRefs.current.forEach(element => {
                // console.log(element)
                if (element !== null) {
                    element.stop()
                }
            })

            // console.log("Video",video.index+1,"Is not viewable and can stop")
            // mediaRefs.current[video.index].stop()
        }
        // console.log("MediaRefs",mediaRefs)
        // Stop all videos

        // Play the current one

        // const cell = mediaRefs.current[video.index]
        // mediaRefs.current.forEach((element,index)=>{
        //     if(index===video.index){
        //         element.play()
        //     }else{
        //         element.stop()
        //     }
        // })
        // if(cell){
        //     cell.play()
        // }else{
        //     cell.stop()
        // }
        // changed.forEach((element,index)=>{
        //     const cell = mediaRefs.current[index]
        //     if(cell){
        //         if(element.isViewable){
        //             console.log(index,"CAN PLAY")
        //             cell.play()
        //         }else{
        //             console.log(index,"Prev Stopped")
        //             cell.stop()
        //         }
        //     }
        // })
    })
    const renderItem = ({ item, index }) => <EachVideo setLoggedIn={setLoggedIn} buyerEmail={userAccountObject?.email} key={index} index={index} currentVideo={currentVideo} pauseVideoMain={pauseVideoMain} ref={EachVideoRef => (mediaRefs.current[index] = EachVideoRef)} video={item} />
    return (
        <View style={{ height: height, width: width,backgroundColor:"black",position:"relative" }}>
            <StatusBar translucent backgroundColor="transparent" />
            {/* <StatusBar barStyle={Device.brand==="google"?"light-content":"dark-content"} backgroundColor={Device.brand==="google"?COLORS.secondary:null}></StatusBar> */}
                <TouchableOpacity onPress={()=>{
                    router.push({
                        pathname:"/(tabs)/Home/basket"
                    })
                    // navigation.navigate("HOME",{screen:"BasketMainScreen"})
                }} style={{position:"absolute",top:50,right:0,padding:10,zIndex:10,opacity:0.8}}>
                    <TopBasket />
                </TouchableOpacity>
            <FlatList
                onEndReached={()=>{
                    // console.log("End")
                    getVideos()
                }}
                onEndReachedThreshold={0.2}
                data={videos}
                snapToInterval={Dimensions.get("window").height}
                decelerationRate="fast"
                windowSize={4}
                maxToRenderPerBatch={2}
                initialNumToRender={2}
                removeClippedSubviews
                viewabilityConfig={{ itemVisiblePercentThreshold: 100 }}
                onViewableItemsChanged={onViewableItemsChanged.current}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
            />
        </View>
    )
}

export default VideoMainScreen