import React, { useContext, useEffect,useCallback, useState } from 'react'
import VideoMainScreen from '../../../screens/VideoMainScreen'
import { ParentContext } from '../../../context/ParentContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'

const VideoScreen = () => {

  const {setLoggedIn,setInVideoScreen} = useContext(ParentContext)
  
  const [videos,setVideos] = useState([])
  
  const dispatch = useDispatch()
  
      // Get Videos
      const getVideos =useCallback(async()=>{
          try {
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/get-all-videos")
            const data = await response.json()
            
            // const data =[]
            
              AsyncStorage.getItem("blockedVideos").then((blockedVideosData)=>{
                const blockedVideos = JSON.parse(blockedVideosData)
                
                const filtered = data.msg.filter(item=>{
                    if(!blockedVideos.includes(item._id)){
                        return item
                    }
                }) 
                setVideos([...videos,...filtered])
                dispatch(addProducts([...productsReducer,...filtered]))
              }).catch(err=>console.log(err))
            // console.log("VIDEOS",data)
          } catch (error) {
            console.log("GET VIDEO ERROR",error.message) 
          }
        },[videos])
  
      useEffect(()=>{ 
        getVideos()
      },[])
  
  return (
    <>
      <VideoMainScreen setLoggedIn={setLoggedIn} setInVideoScreen={setInVideoScreen} getVideos={getVideos} videos={videos}/>
    </>
  )
}

export default VideoScreen