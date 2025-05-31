import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Image, Picker } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions } from 'react-native';
import ForwardedVideo from 'components/ForwardedVideo';
import { useFocusEffect } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const MediaListScreen = ({ navigation }) => {
  const [medias, setMedias] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const [imageSizes, setImageSizes] = useState({});

  const fetchImageSize = (uri, id) => {
    Image.getSize(
      uri,
      (imgWidth, imgHeight) => {
        const maxWidth = imgWidth > screenWidth ? screenWidth : imgWidth;
        const ratio = imgHeight / imgWidth;
        setImageSizes(prev => ({
          ...prev,
          [id]: { width: maxWidth, height: maxWidth * ratio },
        }));
      },
      (error) => {
        console.log('Erro ao pegar tamanho da imagem', error);
      }
    );
  };


  useEffect(() => {
    fetchCategories();
    fetchMedias();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMedias(selectedCategory);
    }, [selectedCategory])
  );

  useEffect(() => {
    medias.forEach(item => {
      if (item.type?.startsWith('image') && !imageSizes[item._id]) {
        fetchImageSize(item.url, item._id);
      }
    });
  }, [medias]);

    useLayoutEffect(() => {
      navigation.setOptions({
        title: 'Feed',
      });
    }, [navigation]);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const res = await fetch('http://localhost:5000/media/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao carregar categorias');
      const data = await res.json();
      setCategories(data);
    } catch {
      Alert.alert('Erro ao buscar categorias');
    }
  };

  const fetchMedias = async (category = '') => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const url = category
        ? `http://localhost:5000/media?category=${category}`
        : 'http://localhost:5000/media';

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao carregar mídias');
      const data = await res.json();

      const sortedData = data
        .filter(item => item && item._id)
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setMedias(sortedData);
    } catch {
      Alert.alert('Erro ao buscar mídias');
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchMedias(cat);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedCategory}
        onValueChange={cat => {
          setSelectedCategory(cat);
          fetchMedias(cat);
        }}
        style={styles.picker}
      >
        <Picker.Item label="Filtro" value="" />
        {categories.map(cat => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <FlatList
        data={medias}
        keyExtractor={item => item._id.toString()}
        renderItem={({ item }) => (
          <View style={styles.mediaItem}>
            {item.type?.startsWith('image') && (
              <Image
                source={{ uri: item.url }}
                style={[
                  styles.mediaImage,
                  imageSizes[item._id] || { width: screenWidth, height: screenWidth * 0.56 }
                ]}
                resizeMode="contain"
              />
            )}
            {item.type?.startsWith('video') && (
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
        ListEmptyComponent={() => <Text>Nenhuma mídia encontrada</Text>}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('MediaUpload')}
      >
        <Text style={styles.addButtonText}>Adicionar Mídia</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  picker: { height: 50, marginBottom: 10 },
  mediaItem: { marginBottom: 20, borderBottomWidth: 1, borderColor: '#ccc', paddingBottom: 10 , overflow: 'hidden'},
  mediaImage: { marginBottom: 5 },
  addButton: {
    backgroundColor: '#AFD34D',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  mediaVideo: {
    width: '100%',
    height: screenWidth * 0.56,
    marginBottom: 10,
    },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default MediaListScreen;
