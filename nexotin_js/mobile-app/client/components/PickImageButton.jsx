import { TouchableOpacity,Image } from "react-native";
import { COLORS } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
const PickImageButton = ({ pickedImage, onPickImage, onRemoveImage }) => (
  pickedImage ? (
    <TouchableOpacity onPress={onPickImage} style={{ position: 'relative' }}>
      <Image source={{ uri: pickedImage }} style={{ width: 40, height: 40, borderRadius: 20 }} />
      <TouchableOpacity
        onPress={onRemoveImage}
        style={{
          position: 'absolute',
          top: -6,
          right: -6,
          backgroundColor: '#fff',
          borderRadius: 10,
          padding: 2,
          elevation: 2,
        }}
      >
        <Feather name="x" size={12} color="#333" />
      </TouchableOpacity>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity 
      onPress={onPickImage}
      style={{
        backgroundColor: COLORS.accent4,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height: 40,
        width: 40,
        borderRadius: 20,
      }}
    >
      <Feather name="image" size={20} color={COLORS.redOrange} />
    </TouchableOpacity>
  )
);

export default PickImageButton