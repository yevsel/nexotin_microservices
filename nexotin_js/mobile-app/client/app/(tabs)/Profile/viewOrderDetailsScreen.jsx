import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import ViewOrderDetailsScreen from '../../../screens/ViewOrderDetailsScreen'
import { ParentContext } from '../../../context/ParentContext'

const viewOrderDetailsScreen = () => {
// const [refreshProfile,setRefreshProfile] = useState(true)
    const {refreshProfile} = useContext(ParentContext)

  return (
    <ViewOrderDetailsScreen />
  )
}

export default viewOrderDetailsScreen