import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Picker,
} from "react-native";
import { Dimensions } from "react-native";
import ForwardedVideo from "../components/ForwardedVideo";
import { useFocusEffect } from "@react-navigation/native";
import { api, MEDIA_ROUTES, isApiConnectionError } from "../config/api";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import { styles } from "../styles/screens/MediaListScreen.styles";

const { width: screenWidth } = Dimensions.get("window");

const MediaListScreen = ({ navigation }) => {
  const [medias, setMedias] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  const [imageSizes, setImageSizes] = useState({});

  const fetchImageSize = (uri, id) => {
    Image.getSize(
      uri,
      (imgWidth, imgHeight) => {
        const maxWidth = imgWidth > screenWidth ? screenWidth : imgWidth;
        const ratio = imgHeight / imgWidth;
        setImageSizes((prev) => ({
          ...prev,
          [id]: { width: maxWidth, height: maxWidth * ratio },
        }));
      },
      (error) => {
        console.log("Error getting photo size", error);
      },
    );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMedias(selectedCategory);
    }, [selectedCategory]),
  );

  useEffect(() => {
    medias.forEach((item) => {
      if (item.type?.startsWith("image") && !imageSizes[item._id]) {
        fetchImageSize(item.url, item._id);
      }
    });
  }, [medias]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Feed",
    });
  }, [navigation]);

  const fetchCategories = async () => {
    setConnectionError(false);

    try {
      const response = await api.get(MEDIA_ROUTES.CATEGORIES);

      // Backend retorna: { success: true, data: [...] }
      const categoriesData = response.data.success
        ? response.data.data
        : response.data;
      setCategories(categoriesData);
    } catch (error) {
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        Alert.alert("Error fetching categories");
      }
    }
  };

  const fetchMedias = async (category = "") => {
    setLoading(true);
    setConnectionError(false);

    try {
      const response = await api.get(MEDIA_ROUTES.LIST, {
        params: category ? { category } : undefined,
      });

      // Backend retorna: { success: true, data: [...], pagination: {...} }
      const mediasData = response.data.success
        ? response.data.data
        : response.data;

      const sortedData = mediasData
        .filter((item) => item && item._id)
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

      setMedias(sortedData);
    } catch (error) {
      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        Alert.alert("Error", "Unable to load media. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchMedias(cat);
  };

  const handleRetryConnection = () => {
    fetchCategories();
    fetchMedias(selectedCategory);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(cat) => {
          setSelectedCategory(cat);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Filter" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      {connectionError ? (
        <ConnectionErrorCard onRetry={handleRetryConnection} />
      ) : null}

      <FlatList
        data={medias}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mediaItem}>
            {item.type?.startsWith("image") && (
              <Image
                source={{ uri: item.url }}
                style={[
                  styles.mediaImage,
                  imageSizes[item._id] || {
                    width: screenWidth,
                    height: screenWidth * 0.56,
                  },
                ]}
                resizeMode="contain"
              />
            )}
            {item.type?.startsWith("video") && (
              <ForwardedVideo
                source={{ uri: item.url }}
                style={styles.mediaVideo}
                controls={true}
                resizeMode="contain"
              />
            )}
            <Text>{item.category}</Text>
            <Text>{new Date(item.uploadedAt).toLocaleString()}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>Media not found</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("MediaUpload")}
      >
        <Text style={styles.addButtonText}>Add Media</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaListScreen;
