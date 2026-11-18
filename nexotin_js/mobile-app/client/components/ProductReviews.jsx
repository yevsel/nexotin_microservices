import { View, Text, Dimensions,KeyboardAvoidingView,Platform,Keyboard, Image,TouchableOpacity, TextInput,Alert } from 'react-native'
import React, { useState,useEffect } from 'react'
import { COLORS } from '../constants/theme'
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import {Audio} from "expo-av"
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from "expo-image-picker"
import reviewsPic from "../assets/reviews.jpg"


const ProductReviews = ({buyerImagesLoading,buyerImages,MAX_TRANSLATE_Y ,fetchProductReview,reviewsLoading,reviews,setFetchProductReview,productData,scrollTo,ScrollView}) => {

    const {width,height} = Dimensions.get("screen")
    const [writeReview,setWriteReview] = useState(false)
    const [reviewText,setReviewText] = useState("")
    const [loadingScreen,setLoadingScreen] = useState(true)
    const [userAccountObject,setUserAccountObject] =useState()
    const [postingReview,setPostingReview] = useState(false)
    const [stringImage,setStringImage] = useState("")
    const [images,setImages] = useState([])
    
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const uploadBase64ImageToCloudinary = async (base64Data) => {
        try {
            const response = await fetch(
            `https://api.cloudinary.com/v1_1/deaijqucs/upload`,
            {
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    file: base64Data,
                    upload_preset: 'verification_images',}),
            });

            const image = await response.json()
            
            return image
            // capturingFunction(image)
            
        } catch (error) {
            return error
            // console.log('Upload error:', error.message);
        }
    };
    
    const captureAllImages = async(images)=>{
        return new Promise(async(resolve,reject)=>{
            let a = []
            try {
                for(i=0;i<images.length;i++){
                    let response = await uploadBase64ImageToCloudinary
                    (images[i])
                    a.push(response)
                }
                resolve(a)
            } catch (error) {
                reject(error)
            }
        })
    }
    
    const majorImageProcess=(images)=>{
        return new Promise((resolve,reject)=>{
            setPostingReview(true)
            let base64ImageArray=[]
            let count=0
            for (let item of images){
                convertToBase64(item.uri).then(data=>{
                    base64ImageArray.push(data)
                    count+=1
                    if(count===images.length){
                        resolve(base64ImageArray)
                    }
                }).catch(err=>{
                    console.log(err)
                    // setLoading(false)
                    }
                )
            }
        })
    }
    
    const convertToBase64 =  (imagePath) => {
        return new Promise(async(resolve,reject)=>{
            let arr = []
            try {
                
                const base64 = await FileSystem.readAsStringAsync(imagePath, {
                encoding: FileSystem.EncodingType.Base64,});
                resolve(`data:image/jpg;base64,${base64}`)
                // resolve(`data%3Aimage%2Fjpeg%3Bbase64%2C,${base64}`)
            } catch (error) {
                reject(error.message)
            }
        })
    }
    
    const pickImage = async () => {
        try{
            // No permissions request is necessary for launching the image library
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                // allowsEditing: true,
                allowsMultipleSelection: true,
                base64:true,
                aspect: [1, 1],
                quality: 0.3,
                
            });
            setStringImage(`data:image/jpeg;base64,${result.assets[0].base64}`)
            if (!result.canceled) {
                if(result.assets.length>3){
                    Alert.alert(
                        'Image Selection',
                        'You can only upload maximum of 3 images',
                        [
                            {
                                text: 'Ok',
                                style:"cancel",
                                onPress: () => {
                                    setImages([]) 
                                    return
                                },
                            },
                        ],)
                }else{
                    setImages(result.assets.reverse());
                }
            }
        }catch(error){
            // console.log(error.message)
        }
    }
    
    const getAccountObject = ()=>{
        // AsyncStorage.clear().then(data=>console.log(data)).catch(err=>console.log(err.message))
        setLoadingScreen(true)
        AsyncStorage.getItem("userAccountObject").then(data=>{
          if(data!==null){
            setUserAccountObject(JSON.parse(data))
            // console.log("DATA",data)
            setLoadingScreen(false)
            return
          } 
        }).catch(error=>{
        //   console.log("Getting account Error",error.message)
          setLoadingScreen(true)
          return
        })
        return
      }
    
    const postReview = async(dataToSend)=>{
        try {
            setPostingReview(true)
            const response = await fetch(process.env.EXPO_PUBLIC_SERVER_ROUTE+"/api/post-product-review",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify(dataToSend)
            })
            setPostingReview(false)
            const data= await response.json()
            setReviewText("")
            setKeyboardHeight(0)
            playSuccess()
            setImages([])
            setFetchProductReview(!fetchProductReview)
        } catch (error) {
            console.log(error.message)
            setPostingReview(false)
        }
    }
    
    useEffect(()=>{
        getAccountObject()
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
            setKeyboardHeight(event.endCoordinates.height);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
          });
          return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
          };
    },[])
    
    const [sound, setSound] = useState();

    async function playSuccess() {
    //   console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync( require("../assets/sounds/success.mp3"))
      ;
      setSound(sound);
  
    //   console.log('Playing Sound');
      await sound.playAsync();
    }
    
    if(loadingScreen){
        return (
            <View>
                <ActivityIndicator color={COLORS.primary}/>
            </View>
        )
    }
    
    // if(loadingScreen===false && reviews?.length===0){
    //     return (
    //         <View style={{marginTop:20}}>
    //             <Text style={{textAlign:"center"}}>No reviews yet.</Text>
    //         </View>
    //     )
    // }
    
    // console.log("",reviews)
    
    return (
    <View style={{position:"relative",height:height*0.6,width:"100%",alignSelf:"center",position:"relative"}}>
        <ScrollView showsVerticalScrollIndicator={false} style={{flex:1}} contentContainerStyle={{ paddingBottom: 100,paddingHorizontal:20}}>
            {
                (reviewsLoading && buyerImagesLoading)?
                <View >
                    <ActivityIndicator size={30} color={COLORS.primary}/>
                </View>
                :
                reviews.length===0?
                <View style={{flexDirection:"column"}}>
                    <Text style={{fontFamily:"Poppins",color:COLORS.newBlack}}>There are currently no reviews; however, you can leave one by tapping the text field below.</Text>
                    
                    
                    <View style={{marginTop:40}}>
                        <Text style={{marginBottom:5,fontFamily:"Poppins",color:COLORS.secondary}}>Sample</Text>
                        <Image source={reviewsPic} resizeMode='contain' style={{width:"100%",height:80,borderWidth:2,borderRadius:15,borderColor:"#ededed"}}/>
                    </View>
                    
                    
                </View>
                :reviews.map((review,index)=>{
                    // console.log('IMAGE',buyerImages[index])
                    return (
                        <View key={index} style={{flexDirection:"row",alignItems:"flex-start",marginBottom:15}}>
                <View>
                    {
                        (buyerImages.length===0||buyerImages[index]===null)?<Image style={{width:40,height:40,borderRadius:50}} source={{uri:"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="}}/>:
                        // null
                        <Image style={{width:40,height:40,borderRadius:50}} source={{uri:buyerImages[index]?.profileImage.secure_url}}/>
                    }
                    
                </View>
                <View style={{flex:1,marginLeft:5}}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={{flex:1,fontFamily:"Poppins",color:"gray",marginRight:10}}>{review.buyerInformation.firstName + " " + review.buyerInformation.lastName}</Text>
                        <Text style={{fontFamily:"Poppins",color:"gray"}}>{
                    new Date(review.createdAt).toDateString()     
                }</Text>
                    </View>
                    <View style={{marginVertical:4,flexDirection:"row",gap:8}}>
                        {
                            review.review?.images?.length > 0 ? (
                                review.review.images.map((image,index) => (
                                    <Image key={index} source={{ uri: image.secure_url }} style={{ width: 70, height: 70,borderRadius:5 }} />
                                    ))
                                    ) : null
                                }
                        </View>
                    <View>
                        <Text style={{fontFamily:"Poppins"}} numberOfLines={4}>{review.review.text}</Text>
                    </View>
                </View>
            </View>
                    )
                })
                
            }
        </ScrollView>
        <View style={{position:"absolute",left:0,right:0,bottom:0}}>
            <View style={{marginHorizontal:15,flexDirection:"row",justifyContent:"flex-end",marginBottom:5,gap:10}}>
                {
                    images.map((image,index)=>{
                        return(
                            <Image key={index} source={{uri:image.uri}} style={{width:60,height:60,borderRadius:5,backgroundColor:"red"}}></Image>
                        )
                    })
                }
            </View>
            <View 
                style={{flexDirection:"row",alignItems:"flex-start",padding:5,borderRadius:30,backgroundColor:"#ededed",marginHorizontal:15}}>
                <TouchableOpacity 
                // disabled={keyboardHeight===0?false:true} 
                onPress={()=>{
                    pickImage()
                }} style={{padding:10,borderRadius:50,borderWidth:1,borderColor:COLORS.redOrange}}>
                    <FontAwesome5 name="images" size={24} color={COLORS.redOrange} />
                </TouchableOpacity>
                <View style={{flex:1}}>
                    
                    <TextInput multiline={true} numberOfLines={2} maxLength={80}  onChangeText={(e)=>{
                        setReviewText(e)
                    }} onFocus={()=>{
                        setWriteReview(true)
                        scrollTo(MAX_TRANSLATE_Y )
                    }} onBlur={()=>setWriteReview(false)} placeholder='Add a review'  value={reviewText} cursorColor={COLORS.primary} style={{fontSize:15,paddingHorizontal:5,fontFamily:"Poppins"}}/>
                </View>
                <TouchableOpacity disabled={reviewText.length<10?true:false} onPress={()=>{
                    let dataToSend = {
                        productId:productData._id,
                        vendorAccountId:productData.accountOwnerID,
                        vendorAccountType:productData.accountType,
                        buyerInformation:userAccountObject,
                        review:{
                            text:reviewText,
                        }
                    }           
                    if(images.length>0){
                        majorImageProcess(images).then(base64=>{
                            captureAllImages(base64).then(cloudinary=>{
                                dataToSend = {
                                    productId:productData._id,
                                    vendorAccountId:productData.accountOwnerID,
                                    vendorAccountType:productData.accountType,
                                    buyerInformation:userAccountObject,
                                    review:{
                                        text:reviewText,
                                        images:cloudinary
                                    }
                                } 
                                postReview(dataToSend)
                            }).catch(err=>console.log(err))
                        }).catch(err=>console.log(err))
                    }else{
                        postReview(dataToSend)
                    }
                }} style={{backgroundColor:COLORS.redOrange,borderRadius:50,padding:10}}>
                    {postingReview?<ActivityIndicator color="white"/>:<Feather name="send" size={24} color="white" />}
                </TouchableOpacity>
            </View>
            <View style={{width:100,height:writeReview?keyboardHeight+40:50}}>
            
            </View>
        </View>
        
    </View>
  )
}

export default ProductReviews