// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../../client/screens/HomeScreen';
import CategoriesScreen from '../../client/screens/CategoriesScreen';
import ViewProductMainScreen from '../../client/screens/ViewProductMainScreen';
import BasketMainScreen from '../../client/screens/BasketMainScreen';
import PaymentMainScreen from '../../client/screens/PaymentMainScreen';
import SearchMainScreen from '../../client/screens/SearchMainScreen';
import SpecificCategoryScreen from '../../client/screens/SpecificCategoryScreen';
import FinalOrderPaymentScreen from '../../client/screens/FinalOrderPaymentScreen';
import VendorProfileScreenForHomeStack from '../../client/screens/VendorProfileScreenForHomeStack';
import TopBasket from '../../client/components/TopBasket';
import { useState } from 'react';
import GoBack from '../../client/components/GoBack';
const Stack = createNativeStackNavigator()

export const HomeStack = ({setLoggedIn,fetchMoreCategoryData,setCategoriesProductsData,categoriesProductsLoading,categoriesProductsData,getProductsByCategory,setShowBottomNavigation,getProducts,productsData,loadingProducts,fetchMoreData})=>{
    
    const [refreshPage,setRefreshPage] = useState(true)
    
    // const [user,setUser] = React.useState(null)
    return(
        <Stack.Navigator initialRouteName='HomeScreen' screenOptions={{headerShown:false}}>
            <Stack.Screen name='HomeScreen' children={()=><HomeScreen  setLoggedIn={setLoggedIn} setShowBottomNavigation={setShowBottomNavigation} getProducts={getProducts} fetchMoreData={fetchMoreData} loadingProducts={loadingProducts} productsData={productsData}/>}/>
            <Stack.Screen name='CategoriesScreen' component={CategoriesScreen}/>
            <Stack.Screen name='ViewProductMainScreen' 
                options={{
                    headerShown:true,
                    headerBackTitleVisible: false,
                    headerTitle:"",
                    headerRight:()=>(<TopBasket setLoggedIn={setLoggedIn}/>),
                    headerLeft:()=>(<GoBack/>),
                    headerBackVisible:false,
                    headerTransparent:true
                }} 
                children={()=><ViewProductMainScreen setLoggedIn={setLoggedIn} setShowBottomNavigation={setShowBottomNavigation}/>} />
            <Stack.Screen name='BasketMainScreen' children={()=><BasketMainScreen setShowBottomNavigation={setShowBottomNavigation}/>}/>
            <Stack.Screen name='PaymentMainScreen' children={()=><PaymentMainScreen/>}/>
            <Stack.Screen name='SearchMainScreen' children={()=><SearchMainScreen setShowBottomNavigation={setShowBottomNavigation}/>}/>
            <Stack.Screen name='SpecificCategoryScreen' children={()=><SpecificCategoryScreen setCategoriesProductsData={setCategoriesProductsData} fetchMoreCategoryData={fetchMoreCategoryData} categoriesProductsLoading={categoriesProductsLoading} categoriesProductsData={categoriesProductsData} getProductsByCategory={getProductsByCategory}/>}/>
            <Stack.Screen name='FinalOrderPaymentScreen' children={()=><FinalOrderPaymentScreen/>}/>
            <Stack.Screen options={{
                headerShown:true,
                headerBackTitleVisible: false,
                headerTitle:"",
                headerTransparent:true,
                headerLeft:()=>(<GoBack/>)
            }} name='VendorProfileScreenForHomeStack' children={()=><VendorProfileScreenForHomeStack setLoggedIn={setLoggedIn} refreshPage={refreshPage} setRefreshPage={setRefreshPage}/>}/>
        </Stack.Navigator>
    )
}