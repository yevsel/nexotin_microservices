import { View, Text } from 'react-native'
import React,{useState} from 'react'
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileMainScreen from '../../client/screens/ProfileMainScreen';
import ViewUserProfile from '../../client/screens/ViewUserProfile';
import EditUserProfileImageScreen from '../../client/screens/EditUserProfileImageScreen';
import ProfileSettings from '../../client/screens/ProfileSettings';
import NotificationSettingsScreen from '../../client/screens/NotificationSettingsScreen';
import MyOrdersMainScreen from '../../client/screens/MyOrdersMainScreen';
import ViewOrderDetailsScreen from '../../client/screens/ViewOrderDetailsScreen';
import TrackOrderMainScreen from '../../client/screens/TrackOrderMainScreen';
import PaymentMainScreen from '../../client/screens/PaymentMainScreen';
import DocumentUploadScreen from '../../client/screens/DocumentUploadScreen';
import SupportMainScreen from '../../client/screens/SupportMainScreen';
import FAQMainScreen from '../../client/screens/FAQMainScreen';
import TermsAndPolicies from '../../client/screens/TermsAndPolicies';
import SavedProducts from '../../client/screens/SavedProductsScreen';
const Stack = createNativeStackNavigator()



const ProfileStack = ({setShowBottomNavigation,setLoggedIn}) => {

    const [refreshProfile,setRefreshProfile] = useState(true)
    // console.log(setShowBottomNavigation(false))

    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="ProfileMainScreen" children={()=><ProfileMainScreen refreshProfile={refreshProfile}/>}/>
            <Stack.Screen name="ViewUserProfile" children={()=><ViewUserProfile setShowBottomNavigation={setShowBottomNavigation}/>}/>
            <Stack.Screen name="EditUserProfileImageScreen" children={()=><EditUserProfileImageScreen setRefreshProfile={setRefreshProfile} refreshProfile={refreshProfile}/>}/>
            <Stack.Screen name="ProfileSettings" children={()=><ProfileSettings setLoggedIn={setLoggedIn}/>}/>
            <Stack.Screen name="NotificationSettingsScreen" children={()=><NotificationSettingsScreen/>}/>
            <Stack.Screen name="MyOrdersMainScreen" children={()=><MyOrdersMainScreen/>}/>
            <Stack.Screen name="ViewOrderDetailsScreen" children={()=><ViewOrderDetailsScreen/>}/>
            <Stack.Screen name="TrackOrderMainScreen" children={()=><TrackOrderMainScreen/>}/>
            <Stack.Screen name="PaymentMainScreen" children={()=><PaymentMainScreen/>}/>
            <Stack.Screen name="DocumentUploadScreen" children={()=><DocumentUploadScreen/>}/>
            <Stack.Screen name="SupportMainScreen" children={()=><SupportMainScreen/>}/>
            <Stack.Screen name="FAQMainScreen" children={()=><FAQMainScreen/>} options={{headerShown:false}} />
            <Stack.Screen name="TermsAndPolicies" children={()=><TermsAndPolicies/>} options={{headerShown:false}} />
            <Stack.Screen name="SavedProducts" children={()=><SavedProducts/>} options={{headerShown:false}}/>
        </Stack.Navigator>
    )
}

export default ProfileStack