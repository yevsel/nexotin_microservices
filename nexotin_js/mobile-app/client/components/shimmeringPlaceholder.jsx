import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const ShimmerPlaceholder = ({ style, shimmerWidth = 120 }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-(shimmerWidth + 50), StyleSheet.flatten(style).width + shimmerWidth + 50],
  });

  return (
    <View style={[styles.container, style, { overflow: 'hidden' }]}>
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslate }, { skewX: '-15deg' }],
            width: shimmerWidth,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e8ecef',
    borderRadius: 8,
    position: 'relative',
  },
  shimmer: {
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default ShimmerPlaceholder;