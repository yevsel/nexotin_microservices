import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignItems:"center",
        // justifyContent:"space-around",
        backgroundColor:"white"
    },
    screenTitle:{
        fontFamily:"Mortend",
        fontSize:20,
        color:COLORS.secondary
    },
    nextButton:{
        backgroundColor:COLORS.redOrange,
        borderRadius:50,
        width:"90%",
        height:60,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        marginTop:10
    },
    nextButtonText:{
        color:"white",
        fontFamily:"Poppins",
        fontSize:17
    },
    googleButton:{
        marginTop:20,
        width:"90%",
        height:60,
        // borderWidth:1,
        // borderColor:COLORS.secondary,
        borderRadius:50,
        flexDirection:"row",
        // alignItems:"flex-end",
        justifyContent:"center",
        alignItems:"center",
    },
    googleButtonText:{
        fontFamily:"Poppins",
        marginHorizontal:5,
        marginTop:5
    },
    appleButton:{
        width:"90%",
        height:60,
        // borderWidth:1,
        // borderColor:COLORS.secondary,
        borderRadius:50,
        flexDirection:"row",
        alignItems:"flex-end",
        justifyContent:"center",
        alignItems:"center",
        marginTop:20
    },
    appleButtonText:{
        fontFamily:"Poppins",
        marginHorizontal:5,
        marginTop:5
    }
})

export default styles