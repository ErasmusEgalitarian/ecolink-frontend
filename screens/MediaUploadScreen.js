import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Picker,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { MEDIA_ENDPOINTS } from "../config/api";
import { styles } from "../styles/screens/MediaUploadScreen.styles";

const { width, height } = Dimensions.get("window");

const MediaUploadScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // referencia para input file no web
  const inputFileRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Upload" });
  }, [navigation]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        const res = await fetch(MEDIA_ENDPOINTS.CATEGORIES, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const response = await res.json();

        // Backend retorna: { success: true, data: [...] }
        const categoriesData = response.success ? response.data : response;

        // Garantir que sempre seja um array
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error("Categories data is not an array:", categoriesData);
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Failed to load categories");
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const pickFileMobile = async () => {
    try {
      // Solicitar permissão para acessar a biblioteca de mídia
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Precisamos de permissão para acessar suas fotos",
        );
        return;
      }

      // Abrir seletor de mídia
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          fileName: asset.fileName || asset.uri.split("/").pop(),
          type: asset.type === "image" ? "image/jpeg" : "video/mp4",
        });
      }
    } catch (error) {
      Alert.alert("Erro", "Erro ao selecionar arquivo");
      console.error(error);
    }
  };

  // handler pro web input file
  const onFileChangeWeb = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const webFile = {
      uri: URL.createObjectURL(selectedFile),
      fileName: selectedFile.name,
      type: selectedFile.type,
    };
    setFile(webFile);
  };

  const pickFile = () => {
    if (Platform.OS === "web") {
      inputFileRef.current.click();
    } else {
      pickFileMobile();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      Alert.alert("Erro", "Selecione um arquivo");
      return;
    }

    if (!category) {
      Alert.alert("Erro", "Selecione uma categoria");
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Erro", "Você precisa estar logado");
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (Platform.OS === "web") {
        // Web - pegar arquivo do input file
        const inputFile = inputFileRef.current;

        if (inputFile && inputFile.files.length > 0) {
          const webFile = inputFile.files[0];
          formData.append("file", webFile);
        } else {
          Alert.alert("Erro", "Arquivo inválido para Web");
          setLoading(false);
          return;
        }
      } else {
        // Mobile - usar o file do state
        formData.append("file", {
          uri: file.uri,
          name: file.fileName || "file",
          type: file.type || "application/octet-stream",
        });
      }

      formData.append("category", category);

      const res = await fetch(MEDIA_ENDPOINTS.UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        Alert.alert("Sucesso", "Upload realizado com sucesso!");

        // Limpar form
        setFile(null);
        setCategory("");
        if (Platform.OS === "web" && inputFileRef.current) {
          inputFileRef.current.value = "";
        }

        // Navegar para lista
        navigation.navigate("MediaList", { refresh: true });
      } else {
        const errorData = await res.json();
        Alert.alert(
          "Erro no upload",
          errorData.message || `Erro ${res.status}: Tente novamente`,
        );
      }
    } catch (err) {
      console.error("Upload exception:", err);
      Alert.alert(
        "Erro",
        err.message || "Algo deu errado. Verifique sua conexão.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/**/}
      {Platform.OS === "web" && (
        <input
          ref={inputFileRef}
          type="file"
          accept="*/*"
          style={{ display: "none" }}
          onChange={onFileChangeWeb}
        />
      )}

      <TouchableOpacity style={styles.pickButton} onPress={pickFile}>
        <Text style={styles.pickButtonText}>Select file</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.fileInfo}>
          {file.type?.startsWith("image") && (
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
          )}
          <Text style={styles.fileName}>
            {file.fileName || "Selected file"}
          </Text>
        </View>
      )}

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={setCategory}
          style={styles.picker}
          prompt="Pick a category"
        >
          <Picker.Item label="Pick a category" value="" />
          {Array.isArray(categories) &&
            categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#AFD34D"
          style={{ marginTop: 20 }}
        />
      ) : (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleUpload}
          activeOpacity={0.7}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MediaUploadScreen;
