import { View, Text, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from "../styles/HomeStyle";
import { COLORS } from "../constants/theme";
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ParentContext } from '../context/ParentContext';

const TopBasket = () => {
  const [lengthOfCart, setLengthOfCart] = useState(0);
  const { setLoggedIn } = useContext(ParentContext);

  const selectedProductsReducer = useSelector(state => state.selectedProductsReducer);
  const allowAppAccessReducer = useSelector(state => state.allowAppAccessReducer);

  useEffect(() => {
    const loadCartItems = async () => {
      try {
        const data = await AsyncStorage.getItem("cartItems");
        if (data) {
          const parsedData = JSON.parse(data);
          setLengthOfCart(parsedData.length);
        }
      } catch (error) {
        console.error("Failed to load cart items:", error);
      }
    };

    loadCartItems();
  }, [selectedProductsReducer]); // Run only on mount

  const getAccountObject = useCallback(() => {
    AsyncStorage.getItem("userAccountObject").then(data => {
      if (data === null) {
        Alert.alert('Login to continue', '', [
          { text: 'Later', style: "destructive" },
          {
            text: 'Login', style: "cancel", onPress: () => {
              router.push("/(onboarding)");
            }
          },
        ]);
      } else {
        router.push({ pathname: "/(tabs)/Home/basket" });
      }
    });
  }, []);

  return (
    <TouchableOpacity onPress={getAccountObject} style={styles.basketContainer}>
      <MaterialCommunityIcons name="shopping" size={24} color={COLORS.secondary} />
      <Text style={{ fontFamily: "Mortend", fontSize: 13 }}>{lengthOfCart}</Text>
    </TouchableOpacity>
  );
};

export default TopBasket;
