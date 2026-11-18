import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ShimmerPlaceholder from './shimmeringPlaceholder'
import { MaterialIcons } from '@expo/vector-icons'
import EachHomeItem from './EachHomeItem'
import { router } from 'expo-router'
import { COLORS } from '../constants/theme'

const HomeProductsPreview = ({ loadingState, data, title, params }) => {
  return (
    <View style={{ width: "100%", marginHorizontal: "auto" }}>
      <View style={{ flexDirection: "row", alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 }}>
        <Text style={{ fontFamily: "Poppins" }}>{title}</Text>
        <MaterialIcons name="bolt" size={20} color="#FF1414" />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} >
        {loadingState
          ? [...Array(5)].map((_, index) => {
              const widths = [100, 70, 80, 120];
              const randomWidth = widths[Math.floor(Math.random() * widths.length)];
              return(
                <View style={{marginLeft:10}} key={index}>
                  <ShimmerPlaceholder
                    style={{
                      width: 170,
                      height: 180,
                      borderRadius: 10,
                      marginRight: 5,
                      marginTop: 10,
                    }}
                  />
                  <ShimmerPlaceholder
                    style={{
                      width: 150,
                      height: 10,
                      borderRadius: 10,
                      marginRight: 10,
                      marginTop: 10,
                    }}
                  />
                  <ShimmerPlaceholder
                    style={{
                      width: 50,
                      height: 10,
                      borderRadius: 10,
                      marginRight: 10,
                      marginTop: 5,
                    }}
                  />
                </View>
              )
            })
          : data.map((item, index) => (
              <EachHomeItem preview deactivateHeight key={index} data={item} />
            ))
        }
        {!loadingState && (
          <TouchableOpacity
            style={{
              width: 170,
              height: 180,
              borderRadius: 16,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
              marginTop: 10,
            }}
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: "/specificProductCategoryScreen",
                params
              })
            }}
          >
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: COLORS.accent2,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
              shadowColor: COLORS.accent2,
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}>
              <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
            </View>
            <Text style={{ 
              fontFamily: "Poppins", 
              color: "#1A1A1A", 
              fontSize: 16, 
              fontWeight: "600",
              letterSpacing: 0.5
            }}>
              View More
            </Text>
            <Text style={{ 
              fontFamily: "Poppins", 
              color: "#666666", 
              fontSize: 12, 
              marginTop: 2,
              textAlign: "center"
            }}>
              {/* Explore all items */}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  )
}

export default HomeProductsPreview