// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View,Text } from "react-native";
import VideoMainScreen from "../../client/screens/VideoMainScreen";
import VendorProfileScreen from "../../client/screens/VendorProfileScreen";
import GoBack from "../../client/components/GoBack";
const Stack = createNativeStackNavigator()


export const VideoStack = ({setInVideoScreen,getVideos,videos,setLoggedIn})=>{
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="VideoMainScreen" children={()=><VideoMainScreen setLoggedIn={setLoggedIn} setInVideoScreen={setInVideoScreen} getVideos={getVideos} videos={videos}/>}/>
            <Stack.Screen options={{
                headerShown:true,
                headerBackTitleVisible: false,
                headerTitle:"",
                headerTransparent:true,
                headerLeft:()=>(<GoBack/>)
            }} name="VendorProfileScreen" children={()=><VendorProfileScreen setLoggedIn={setLoggedIn} setInVideoScreen={setInVideoScreen}/>}/>
        </Stack.Navigator>
    )
}