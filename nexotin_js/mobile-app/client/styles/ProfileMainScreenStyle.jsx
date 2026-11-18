import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
const styles = StyleSheet.create({
    bannerContainer:{
        height:110,
        width:"100%",
        backgroundColor:COLORS.accent2
    },
    bannerSettings:{
        height:200,
        // backgroundColor:"red",
        // width:"auto"
        flex:1,
        alignItems:"flex-end",
        justifyContent:"space-between",
        padding:20,
        paddingTop:40
    },
    profileInformationContainer:{
        // width:"95%",
        marginVertical:10,
        // backgroundColor:"red",
        flexDirection:"row",
        height:65,
        alignItems:"center",
        // backgroundColor:"red"
        // justifyContent:"space-between"
    },
    profileInformationLeft:{
        width:80,
        position:"relative",
        // backgroundColor:"blue",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    },
    profileInformationCenter:{
        flex:1,
        paddingHorizontal:5,
        // backgroundColor:"red"
    },
    profileInformationRight:{
        // backgroundColor:"yellow",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"row"
    },
    profileVideosAndItemsContainer:{
        marginTop:0,
        // backgroundColor:"white",
        width:"100%",
        flex:2
    },
    profileVideosAndItemsSelectionContainer:{
        flexDirection:"row",
        width:"100%",
    },
    profileVideosAndItemsBorderBottomContainer:{
        width:"100%",
        flexDirection:"row",
        justifyContent:"center",
        marginVertical:10
    },
    profileMainVideosAndItemsContainer:{
        width:"100%",
        // backgroundColor:"red",
        flex:1,
    }
})

export default styles