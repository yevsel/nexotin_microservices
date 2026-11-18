import { View, Text,TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { COLORS } from '../constants/theme';
import { router } from 'expo-router';

const GoBackp = ({ style }) => {

    // const navigation = useNavigation()

    return (
      <TouchableOpacity onPress={()=>router.push("/(tabs)/Home")} style={[{ backgroundColor: "#E2E8F0", padding: 8, borderRadius: 5 }, style]}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
    );
  };
export default GoBackp