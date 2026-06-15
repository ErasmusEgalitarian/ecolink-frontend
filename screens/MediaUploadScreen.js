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
import * as ImagePicker from "expo-image-picker";
import {
  api,
  API_UPLOAD_TIMEOUT_MS,
  MEDIA_ROUTES,
  isApiConnectionError,
} from "../config/api";
import ConnectionErrorCard from "../components/ConnectionErrorCard";
import { styles } from "../styles/screens/MediaUploadScreen.styles";

const { width, height } = Dimensions.get("window");

const MediaUploadScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState(false);

  // referencia para input file no web
  const inputFileRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: "Upload" });
  }, [navigation]);

  const fetchCategories = async () => {
    setConnectionError(false);

    try {
      const response = await api.get(MEDIA_ROUTES.CATEGORIES);

      // Backend retorna: { success: true, data: [...] }
      const categoriesData = response.data.success
        ? response.data.data
        : response.data;

      // Garantir que sempre seja um array
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        console.error("Categories data is not an array:", categoriesData);
        setCategories([]);
      }
      setConnectionError(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);

      if (isApiConnectionError(error)) {
        setConnectionError(true);
      } else {
        Alert.alert("Error", "Failed to load categories");
      }
    }
  };

  useEffect(() => {
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
    setConnectionError(false);

    try {
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

      await api.post(MEDIA_ROUTES.UPLOAD, formData, {
        timeout: API_UPLOAD_TIMEOUT_MS,
      });

      Alert.alert("Sucesso", "Upload realizado com sucesso!");
      setConnectionError(false);

      // Limpar form
      setFile(null);
      setCategory("");
      if (Platform.OS === "web" && inputFileRef.current) {
        inputFileRef.current.value = "";
      }

      // Navegar para lista
      navigation.navigate("MediaList", { refresh: true });
    } catch (err) {
      console.error("Upload exception:", err);

      if (isApiConnectionError(err)) {
        setConnectionError(true);
      } else {
        Alert.alert(
          "Erro no upload",
          err.data?.message || err.message || "Erro ao enviar arquivo.",
        );
      }
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

      {connectionError ? (
        <ConnectionErrorCard
          onRetry={file && category ? handleUpload : fetchCategories}
        />
      ) : null}

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
