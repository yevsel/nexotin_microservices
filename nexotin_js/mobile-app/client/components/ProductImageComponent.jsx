import React, { useState } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const ProductImageComponent = ({ source, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  const onLoadEnd = () => {
    setIsLoading(false);
  };
  
  const transformImage = (image) => {
    let cuts = image.split("/");
    let newCuts = cuts.slice(0, cuts.length - 3);
    let imageURL = cuts.slice(cuts.length - 3);
    return newCuts.join("/") + "/q_40/" + imageURL.join("/");
  };

  return (
    <View style={style}>
      {isLoading && (
        <ShimmerPlaceHolder
          style={{ width: '100%', height: '100%', borderRadius: 8 }}
          shimmerColors={['#f6f7f8', '#edeef1', '#f6f7f8']}
          LinearGradient={LinearGradient}
          visible={!isLoading} 
        />
      )}
      <Image
        source={{ uri: transformImage(source) }}
        style={[style, { width: '100%',
            height: '100%',
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 8 }]}
        priority="high"
        onLoadEnd={onLoadEnd}
        transition={500}
        contentFit='cover'
      />
    </View>
  );
};

export default ProductImageComponent;
