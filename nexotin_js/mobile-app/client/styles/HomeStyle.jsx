import {StyleSheet} from "react-native"
import {COLORS} from "../constants/theme"
import {SIZES} from "../constants/theme"


export const styles = StyleSheet.create({
    heading:{
        color:COLORS.black,
        fontSize:SIZES.headingSize,
        textAlign:"center"
    },
    headingContainer:{
        padding:SIZES.padding,
        backgroundColor:"white"
    },
    headingTextInputContainer:{
        flex:1,
        flexDirection:"row",
        borderWidth:1,
        borderColor:COLORS.gray,
        marginTop:8,
        padding:6,
        paddingVertical:10,
        borderRadius:50
    },
    basketContainer:{
        marginHorizontal:10,
        position:"relative",
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"white",
        padding:5,
        borderRadius:50
    },
    basketQuantity:{
        borderRadius:20,
        padding:5,
        // flexDirection:"row"
    },
    basketQuantityText:{
        // backgroundColor:COLORS.primary,
        // fontWeight:"bold",
        // fontSize:15,
        // paddingHorizontal:10,
        // flexDirection:"row",
        // fontFamily:"PoppinsBol"
    },
    headingTextInput:{
        flex:1,
        fontSize:SIZES.normalTextSize,
        marginHorizontal:10,
    },
    categoriesContainer:{
        marginHorizontal:10,
        justifyContent:"center",
        alignItems:"center"
    },
    categoriesIconsContainer:{
        // backgroundColor:COLORS.accent1,
        // padding:1,
        // fontSize:10,
        borderRadius:40,
        // marginBottom:7
    },
    bannerContainer: {
        transform: [{ translateY: -15 }], // move 20 units up
    }
,    
    bannerImage:{
        // marginHorizontal:10,
        // marginLeft:15,
        width:"96%",
        margin:"auto"
    },
    eachHomeItemContainer:{
        marginVertical:10, 
        marginHorizontal:7,
        // backgroundColor:"red",
        maxWidth:205,
        // borderWidth:1,
        // borderColor:"red"
    },
    eachHomeItemTextContainer:{
        marginVertical:5
    },
    eachHomeItemImageContainer:{
        position:"relative",
        // borderWidth:1,
        // borderColor:"red"
    },
    eachHomeItemName:{
        fontFamily:"Poppins",
        fontSize:12,
        lineHeight:18,
        color:"#333"
    },
    eachHomeItemPrice:{
        fontFamily:"Mortend",
        fontSize:15,
        color:"#333"
    },
    eachItemFavoriteButton:{
        position:"absolute",
        right:0,
        margin:10
    },
    itemContainerHeading:{
        fontFamily:"PoppinsBold",
        fontSize:25,
        color:"#333",
        margin:10
    },
    eachFlashSaleContainer:{
        margin:10
    },
    eachFlashSaleImageContainer:{
        borderRadius:20,
        overflow:"hidden",
        position:"relative"
    },
    eachFlashSaleBoltIcon:{
        padding:4,
        position:"absolute",
        alignItems:"center",
        backgroundColor:COLORS.primary,
        borderBottomRightRadius:15
    },
    eachFlashSaleBoltIconText:{
        fontWeight:"bold"
    },
    eachFlashSaleNewPrice:{
        marginTop:7,
        fontFamily:"Mortend"
    },
    eachFlashSaleOldPrice:{
        fontFamily:"Mortend",
        color:"gray",
        textDecorationLine:"line-through",
        textDecorationStyle:"solid"
    }
})
