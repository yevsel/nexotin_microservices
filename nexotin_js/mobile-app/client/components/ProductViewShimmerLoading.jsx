import React, { useEffect, useRef, memo } from 'react';
import { View, Animated, Dimensions, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Static arrays to avoid re-creation
const carouselDots = [0, 1, 2];
const actionButtons = [0, 1, 2];
const sizes = [0, 1, 2, 3];
const colors = [0, 1, 2, 3, 4];
const relatedItems = [0, 1, 2, 3];

// Memoized ShimmerPlaceholder component
const ShimmerPlaceholder = memo(({ width, height, borderRadius = 0, style = {} }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      animatedValue.setValue(0);
      Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 2000, // Increased duration for calmer, slower shimmer
          useNativeDriver: true, // Use native driver for better performance
        })
      ).start();
    };
    animate();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.5, width * 0.5], // Reduced translation range for subtler effect
  });

  return (
    <View
      style={[
        { width, height, borderRadius, backgroundColor: '#f5f5f5', overflow: 'hidden' }, // Softer base color
        style,
      ]}
    >
      <Animated.View
        style={{
          width: '100%',
          height: '100%',
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['#f5f5f5', 'rgba(255,255,255,0.4)', '#f5f5f5']} // Softer gradient with lower opacity
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: '100%', height: '100%' }}
        />
      </Animated.View>
    </View>
  );
});

// Reusable component for repeated shimmer sections
const ShimmerRow = ({ count, width, height, borderRadius, style }) => (
  <View style={{ flexDirection: 'row', gap: 10 }}>
    {Array(count)
      .fill(0)
      .map((_, index) => (
        <ShimmerPlaceholder
          key={index}
          width={width}
          height={height}
          borderRadius={borderRadius}
          style={style}
        />
      ))}
  </View>
);

const ProductViewShimmerLoading = () => {
  const width = Dimensions.get('window').width; // Directly use window width

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50, backgroundColor: 'white' }}
      >
        {/* Product Image Carousel Shimmer */}
        <View>
          <ShimmerPlaceholder
            width={width}
            height={450}
            borderRadius={0}
            style={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
          />
          <View style={{ position: 'absolute', bottom: 15, alignSelf: 'center', flexDirection: 'row' }}>
            <ShimmerRow count={3} width={8} height={8} borderRadius={4} style={{ marginHorizontal: 5 }} />
          </View>
        </View>

        <View style={{ margin: 10 }}>
          {/* Product Name and Actions */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <ShimmerPlaceholder width={width * 0.6} height={24} borderRadius={4} />
              <ShimmerPlaceholder width={width * 0.4} height={20} borderRadius={4} style={{ marginTop: 5 }} />
            </View>
            <ShimmerRow count={2} width={40} height={40} borderRadius={20} style={{ marginLeft: 8 }} />
          </View>

          {/* Action Buttons */}
          <ShimmerRow
            count={3}
            width={(width - 40) / 3}
            height={40}
            borderRadius={10}
            style={{ marginBottom: 15 }}
          />

          {/* Second Row Action Buttons */}
          <ShimmerRow
            count={3}
            width={(width - 40) / 3}
            height={40}
            borderRadius={10}
            style={{ marginBottom: 20 }}
          />

          {/* Sizes Section */}
          <View style={{ marginBottom: 15 }}>
            <ShimmerPlaceholder width={60} height={20} borderRadius={4} style={{ marginBottom: 10 }} />
            <ShimmerRow count={4} width={50} height={35} borderRadius={10} style={{ marginRight: 10 }} />
          </View>

          {/* Colors Section */}
          <View style={{ marginBottom: 20 }}>
            <ShimmerPlaceholder width={60} height={20} borderRadius={4} style={{ marginBottom: 10 }} />
            <ShimmerRow count={5} width={35} height={35} borderRadius={18} style={{ marginRight: 10 }} />
          </View>


          {/* Add to Cart Button */}
          <ShimmerPlaceholder width={width - 20} height={80} borderRadius={20} style={{ marginBottom: 20 }} />

          
        </View>
      </ScrollView>
    </>
  );
};

export default ProductViewShimmerLoading;