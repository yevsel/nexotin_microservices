
import { StyleSheet } from "react-native"
import { COLORS } from "../constants/theme"
const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:"row",
        alignItems:"center",
        padding:10,
        backgroundColor:"white"
    },
    headerContainerTitle:{
        flex:1,
    },
    headerContainerTitleText:{
        textAlign:"center",
        fontFamily:"Poppins",
        fontSize:20,
        color:"gray"
    },
    menAndWomenContainer:{
        padding:10,
        flexDirection:"row",
        backgroundColor:"white",
    },
    menContainer:{
        borderWidth:3,
        borderColor:"gray",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:18,
        backgroundColor:COLORS.secondary,
        marginRight:10,
        borderRadius:40
    },
    womenContainer:{
        borderWidth:3,
        borderColor:"gray",
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        paddingVertical:18,
        marginLeft:10,
        borderRadius:40
    },
    menAndWomenText:{
        fontFamily:"Poppins",
        fontSize:18,
        color:"white",
        fontWeight:"bold"
    },
    eachCategoryItem:{
        flexDirection:"row",
        alignContent:"center",
        justifyContent:"center",
        // height:50,
        // marginBottom:20,
        marginTop:20,
        paddingVertical:20,
        paddingHorizontal:20,
        backgroundColor:COLORS.accent4,
        // borderRadius:0,
        zIndex:2
    },
    eachCategoryItemTextContainer:{
        flex:1,
        flexDirection:"row",
        alignItems:"center",
        paddingLeft:20,
        // backgroundColor:"red"
    },
    eachCategoryItemTextContainerText:{
        fontFamily:"Poppins",
        fontSize:18,
        color:"#333"
    },
    subCategoryContainer:{
        backgroundColor:COLORS.accent4,
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20,
        // marginTop:-48
        // paddingTop:20
    },
    eachSubCategoryTextContainer:{
        paddingVertical:10,
        paddingHorizontal:20,
    },
    eachSubCategoryText:{
        fontFamily:"Mortend",
        color:"#333"
    }
})

export default styles