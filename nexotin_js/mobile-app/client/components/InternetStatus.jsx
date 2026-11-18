// import React, { useEffect, useState } from 'react';
// import { View, Text } from 'react-native';
// import * as Network from 'expo-network';

// const InternetStatus = () => {
//   const [isConnected, setIsConnected] = useState(null);

    
//   useEffect(() => {
//     const checkConnection = async () => {
//       const networkState = await Network.getNetworkStateAsync();
//       setIsConnected(networkState.isInternetReachable);
      
      
//       console.log("Status",networkState.isInternetReachable)
//     };

//     checkConnection();

//     // Optional: Add a polling interval or re-check on focus if desired
//     const interval = setInterval(checkConnection, 5000); // every 5 seconds
//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <View>
//       <Text>
//         {isConnected === null
//           ? 'Checking connection...'
//           : isConnected
//           ? 'Connected to the internet ✅'
//           : 'No internet connection ❌'}
//       </Text>
//     </View>
//   );
// };

// export default InternetStatus;
