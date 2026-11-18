import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

const styles = StyleSheet.create({
    headerContainer:{
        // textAlign:"center"
        // backgroundColor:COLORS.white
    },
    headerContainerText:{
        textAlign:"center",
        fontFamily:"Poppins",
        paddingVertical:10,
        fontSize:20,
        color:"gray"
    },
    headerResetButtonContainer:{
        flexDirection:"row",
        alignContent:"center",
        justifyContent:"center"
    },
    headerResetButton:{
        paddingHorizontal:15,
        paddingVertical:5,
        borderWidth:4,
        borderColor:"red",
        borderRadius:30,
        backgroundColor:"pink",
        marginBottom:10
    },
    headerResetButtonText:{
        fontFamily:"PoppinsBold",
        color:"red"
    },
    savedProductContainer:{
        height:"100%",
        backgroundColor:"white",
        // paddingBottom:200
    },
    eachSavedItemContainer:{
        position:"relative",
        marginHorizontal:10,
        marginVertical:10,
    },
    eachSavedItemFavoriteButton:{
        position:"absolute",
        right:15,
        top:10
    },
    eachSavedProductName:{
        fontFamily:"Poppins",
        fontSize:14,
        lineHeight:18,
        color:"#333"
    },
    eachSavedProductPrice:{
        fontFamily:"Mortend"
    }
})


export default styles