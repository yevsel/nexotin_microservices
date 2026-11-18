import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image } from 'expo-image'; // Since you're using expo-image
import React from 'react';
import Banner3 from "../assets/Banner7.png"
import Banner1 from "../assets/Banner6.png"
import Banner4 from "../assets/Banner8.png"
import Banner5 from "../assets/Banner5.png"


const { width } = Dimensions.get('window');

const BannerCarousel = () => {
  const banners = [Banner3, Banner1, Banner5, Banner4]; // your imported banners

  return (
    <View >
      <Carousel
        loop
        autoPlay
        autoPlayInterval={3000}
        width={width} // 85% width
        height={200}         // banner height
        data={banners}
        scrollAnimationDuration={1000}
        mode="stack" // or "normal" or "stack"
        // modeConfig={{
        //   parallaxScrollingScale: 0.9,
        //   parallaxScrollingOffset: 60,
        // }}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
            //   borderRadius: 15,
              overflow: 'hidden',
            }}
          >
            <Image
              source={item}
              style={{ width: '100%', height: '100%' }}
              contentFit="contain"
            />
          </View>
        )}
      />
    </View>
  );
};

export default BannerCarousel;
