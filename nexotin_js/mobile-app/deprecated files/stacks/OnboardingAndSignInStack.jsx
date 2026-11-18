import { View, Text } from 'react-native'
import React from 'react'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from '../../client/screens/OnboardingScreen'
import IntroScreen from '../../client/screens/IntroScreen'
import SignInScreen from '../../client/screens/SignInScreen'
import SignUpScreen from '../../client/screens/SignUpScreen'
import OTPScreen from '../../client/screens/OTPScreen'
import CreateAccountScreen from '../../client/screens/CreateAccountScreen'
import TermsAndConditionsMainScreen from '../../client/screens/TermsAndConditionsMainScreen'
import ForgotPasswordMainScreen from '../../client/screens/ForgotPasswordMainScreen'

const Stack = createNativeStackNavigator()

const OnboardingAndSignInStack = ({setLoggedIn}) => {
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name='OnboardingScreen'  component={OnboardingScreen}/>
            <Stack.Screen name='IntroScreen' component={IntroScreen}/>
            <Stack.Screen name='SignInScreen' children={()=><SignInScreen setLoggedIn={setLoggedIn}/>}/>
            <Stack.Screen name='SignUpScreen' component={SignUpScreen}/>
            <Stack.Screen name='OTPScreen' component={OTPScreen}/>
            <Stack.Screen name='CreateAccountScreen' component={CreateAccountScreen}/>
            <Stack.Screen name='TermsAndConditionsMainScreen' component={TermsAndConditionsMainScreen}/>
            <Stack.Screen name='ForgotPasswordMainScreen' component={ForgotPasswordMainScreen}/>
        </Stack.Navigator>
    )
}

export default OnboardingAndSignInStack