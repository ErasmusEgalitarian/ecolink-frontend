import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/ImageGallery.styles";

const ImageGallery = ({ images, onRemove, title }) => {
  if (images.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title} ({images.length})
      </Text>
      <View style={styles.grid}>
        {images.map((uri, index) => (
          <View key={index} style={styles.imageWrapper}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(index)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={28} color="#E63946" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ImageGallery;
