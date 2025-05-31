import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Picker,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const { width, height } = Dimensions.get('window');

const MediaUploadScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // referencia para input file no web
  const inputFileRef = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Upload' });
  }, [navigation]);

  useEffect(() => {
    fetch('http://localhost:5000/media/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => Alert.alert('Error fetching medias'));
  }, []);

  const pickFileMobile = async () => {
    const options = { mediaType: 'mixed', includeBase64: false };
    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      if (result.errorCode) {
        Alert.alert('Erro', result.errorMessage || 'Error selecting file');
        return;
      }
      if (result.assets && result.assets.length > 0) {
        setFile(result.assets[0]);
      }
    } catch {
      Alert.alert('Erro', 'Unknown error selecting file');
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
    if (Platform.OS === 'web') {
      inputFileRef.current.click();
    } else {
      pickFileMobile();
    }
  };

  const handleUpload = async () => {
    if (!file) return Alert.alert('Select file');
    if (!category) return Alert.alert('Select category');

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('You need to be logged in');
        setLoading(false);
        return;
      }

      const formData = new FormData();

      if (Platform.OS === 'web') {
        // pra quando estivermos usando expo no web
        const inputFile = inputFileRef.current;
        if (inputFile && inputFile.files.length > 0) {
          formData.append('file', inputFile.files[0]);
        } else {
          Alert.alert('Error', 'Unvalid file');
          setLoading(false);
          return;
        }
      } else {
        formData.append('file', {
          uri: file.uri,
          name: file.fileName || 'file',
          type: file.type || 'application/octet-stream',
        });
      }

      formData.append('category', category);

      const res = await fetch('http://localhost:5000/media/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        Alert.alert('Success', 'Successful upload');
        setFile(null);
        setCategory('');
        if (Platform.OS === 'web' && inputFileRef.current) {
          inputFileRef.current.value = null; 
        }
        navigation.navigate('MediaList'); 
      } else {
        const data = await res.json();
        Alert.alert('Upload error', data.message || 'Try again');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Something went wrong...');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/**/}
      {Platform.OS === 'web' && (
        <input
          ref={inputFileRef}
          type="file"
          accept="*/*"
          style={{ display: 'none' }}
          onChange={onFileChangeWeb}
        />
      )}

      <TouchableOpacity style={styles.pickButton} onPress={pickFile}>
        <Text style={styles.pickButtonText}>Select file</Text>
      </TouchableOpacity>

      {file && (
        <View style={styles.fileInfo}>
          {file.type?.startsWith('image') && (
            <Image source={{ uri: file.uri }} style={styles.previewImage} />
          )}
          <Text style={styles.fileName}>{file.fileName || 'Selected file'}</Text>
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
          {categories.map(cat => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#AFD34D" style={{ marginTop: 20 }} />
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
          <Text style={styles.uploadButtonText}>Enviar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.1,
    paddingTop: height * 0.05,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  pickButton: {
    backgroundColor: '#AFD34D',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.2,
    borderRadius: 25,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  pickButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  fileInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: width * 0.5,
    height: height * 0.25,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 10,
  },
  fileName: {
    fontSize: width * 0.04,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#AFD34D',
    borderRadius: 10,
    width: '100%',
    marginBottom: 30,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 50,
  },
  uploadButton: {
    backgroundColor: '#AFD34D',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.3,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

export default MediaUploadScreen;
