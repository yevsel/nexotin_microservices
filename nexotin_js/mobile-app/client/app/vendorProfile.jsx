import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import VendorProfileScreenForHomeStack from '../screens/VendorProfileScreenForHomeStack'
import { ParentContext } from '../context/ParentContext'

const vendorProfile = () => {

    // setLoggedIn={setLoggedIn} refreshPage={refreshPage} setRefreshPage={setRefreshPage}

    const {setLoggedIn,refreshPage,setRefreshPage} = useContext(ParentContext)

  return (
    <>
        <VendorProfileScreenForHomeStack setLoggedIn={setLoggedIn} refreshPage={refreshPage} setRefreshPage={setRefreshPage}/>
    </>
  )
}

export default vendorProfile