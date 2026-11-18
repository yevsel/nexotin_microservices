import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import AllMessagesScreen from '../../../screens/AllMessagesScreen'
import { ParentContext } from '../../../context/ParentContext'

const MessageScreen = () => {

  const {loggedIn,setLoggedIn} = useContext(ParentContext)

  return (
    <>
      <AllMessagesScreen loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
    </>
  )
}

export default MessageScreen