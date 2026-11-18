import { StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"space-around",
        backgroundColor:"white"
    },
    screenTitle:{
        fontFamily:"Mortend",
        fontSize:20,
        marginVertical:20,
        color:COLORS.secondary
    },
    circleContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginTop:20
    },
    eachCircle:{
        width:60,
        height:60,
        borderWidth:1,
        borderColor:"black",
        borderRadius:50,
        justifyContent:"center",
        alignItems:"center"
    },
    eachCircleText:{
        fontFamily:"Poppins",
        fontSize:20,
        fontWeight:"bold"
    },
    nextButton:{
        backgroundColor:COLORS.secondary,
        borderRadius:50,
        width:"90%",
        height:60,
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        // marginTop:80
        
    },
    nextButtonText:{
        color:"white",
        fontFamily:"Poppins",
        fontSize:17
    }
})

export default styles