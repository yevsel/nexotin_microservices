import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState, useRef, useCallback, useMemo } from 'react'
import { Video, ResizeMode } from 'expo-av'
import { Entypo } from '@expo/vector-icons'

const EachVendorVideo = ({ item }) => {
  const [playVideo, setPlayVideo] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef(null)

  // Memoize the thumbnail URL to avoid recalculating on each render
  const thumbnailUrl = useMemo(() => {
    if (!item?.videoObject?.secure_url) return null
    const urlParts = item.videoObject.secure_url.split('.')
    return urlParts.slice(0, -1).join('.') + '.png'
  }, [item?.videoObject?.secure_url])

  // Memoize the optimized thumbnail URL
  const optimizedThumbnailUrl = useMemo(() => {
    if (!thumbnailUrl) return null
    
    const urlParts = thumbnailUrl.split('/')
    const newParts = urlParts.slice(0, urlParts.length - 3)
    const imagePath = urlParts.slice(urlParts.length - 3)
    
    return `${newParts.join('/')}/q_40/${imagePath.join('/')}`
  }, [thumbnailUrl])

  // Handle video play with loading state
  const handlePlayVideo = useCallback(() => {
    setIsLoading(true)
    setPlayVideo(true)
    setHasError(false)
  }, [])

  // Handle video load success
  const handleVideoLoad = useCallback(async () => {
    setIsLoading(false)
    try {
      await videoRef.current?.presentFullscreenPlayer()
    } catch (error) {
      console.warn('Could not present fullscreen player:', error)
    }
  }, [])

  // Handle video load error
  const handleVideoError = useCallback((error) => {
    console.error('Video load error:', error)
    setIsLoading(false)
    setHasError(true)
    setPlayVideo(false) // Reset to thumbnail view
  }, [])

  // Early return if no item data
  if (!item) {
    return null
  }

  const formatLikes = (likes) => {
    if (likes >= 1000000) return `${(likes / 1000000).toFixed(1)}M`
    if (likes >= 1000) return `${(likes / 1000).toFixed(1)}K`
    return likes?.toString() || '0'
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handlePlayVideo}
        style={styles.videoContainer}
        activeOpacity={0.8}
        disabled={playVideo}
      >
        {playVideo ? (
          <View style={styles.videoWrapper}>
            <Video
              ref={videoRef}
              style={styles.video}
              source={{ uri: item.videoObject.secure_url }}
              useNativeControls={true}
              resizeMode={ResizeMode.COVER}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              isLooping={true}
              shouldPlay={true}
              isMuted={false}
            />
            {isLoading && (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator size="large" color="#ff4444" />
              </View>
            )}
            {hasError && (
              <View style={styles.errorOverlay}>
                <Text style={styles.errorText}>Failed to load video</Text>
                <TouchableOpacity 
                  onPress={() => setPlayVideo(false)}
                  style={styles.retryButton}
                >
                  <Text style={styles.retryText}>Tap to retry</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <Image 
            source={{ uri: optimizedThumbnailUrl }} 
            style={styles.thumbnail}
            resizeMode="cover"
            onError={() => console.warn('Thumbnail failed to load')}
          />
        )}

        {/* Play button overlay for thumbnail */}
        {!playVideo && (
          <View style={styles.playButtonOverlay}>
            <Entypo name="controller-play" size={48} color="white" />
          </View>
        )}

        {/* Likes overlay */}
        <View style={styles.likesContainer}>
          <Entypo name="heart" size={20} color="white" />
          <Text style={styles.likesText}>
            {formatLikes(item.likes)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {item.title || 'Untitled Video'}
      </Text>
    </View>
  )
}

const styles = {
  container: {
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  likesContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  likesText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    fontFamily: 'PoppinsBold',
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginTop: 8,
    marginHorizontal: 4,
  },
}

export default EachVendorVideo