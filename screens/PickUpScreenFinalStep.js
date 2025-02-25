import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from "expo-image-picker";
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const PickUpScreenFinalStep = ({ route, navigation }) => {
    const { t } = useTranslation();
    const { items } = route.params;
    const [images, setImages] = useState([]);
    const [setError] = useState(null);
    const [comment, setComment] = useState('');

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                `Sorry, we need camera roll permission to upload images.`
            );
        } else {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled) {
                // Add the new image URI to the array
                setImages((prevImages) => [...prevImages, result.assets[0].uri]);
                setError(null);
            }
        }
    };

    const createWasteEntry = async (comment, images) => {
        try {
            const userId = await AsyncStorage.getItem('userId');

            for (const item of items) {
                if (!item.type || !item.quantity) {
                    continue;
                }

                const payload = {
                    userId,
                    materialType: item.type,
                    description: comment,
                    qtdMaterial: item.quantity,
                };

                const response = await fetch('http://192.168.0.168:5000/api/donation', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`Failed to create donation for ${item.type}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(`Donation created for ${item.type}:`, data);
            }

            Alert.alert('Success', t('PickupFinal.created'), [
                { text: 'OK', onPress: () => navigation.navigate('PickUpScreenMap') },
            ]);
        } catch (error) {
            console.error('Error creating donation:', error);
            Alert.alert('Error', error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.InputTXT}>{t('PickupFinal.description')}</Text>
            <Text style={styles.InputTXTExtra}>{t('PickupFinal.descriptionExtra')}</Text>
            <TextInput
                style={[styles.multiline, styles.input]}
                onChangeText={setComment}
                value={comment}
                keyboardType={"default"}
                multiline={true}
            />

            <Text style={styles.InputTXT}>{t('PickupFinal.photo')}</Text>
            <Text style={styles.InputTXTExtra}>{t('PickupFinal.photoExtra')}</Text>
            <View style={styles.imageUploadContainerOuter}>
                {/* Display Uploaded Images */}
                <View style={styles.imageUploadContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
                        {/* Camera Icon */}
                        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
                            <Icon name="camera" size={60} color="#999999" />
                        </TouchableOpacity>
                        
                        {images.map((imageUri, index) => (
                            <View key={index} style={{ width: 120, marginRight: 12 }}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.uploadedImage}
                                    resizeMode="cover"
                                />
                                {/* Remove Button */}
                                <TouchableOpacity style={styles.removeButton} onPress={() => removeImage(index)}>
                                    <Icon style={{marginLeft: 0.7}} name="close" size={16} color="white" />
                                </TouchableOpacity>
                            </View>
                        ))}

                    </ScrollView>
                </View>

            </View>

            {/* Map through the items array to display type and quantity */}
            <View style={styles.materialTXT}>
                {items.map((item) => (
                    !item.isNew && (
                        <View style={styles.materialTXTInner} key={item.id}>
                            <Text>
                                {item.type}: {item.quantity}
                            </Text>
                        </View>
                    )
                ))}
            </View>

            <TouchableOpacity
                style={styles.loginButton}
                onPress={() => {
                    createWasteEntry(
                        comment,
                        images
                    );
                }}
            >
                <Text style={styles.buttonText}>{t('PickupFinal.buttonTXT')}</Text>
            </TouchableOpacity>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        marginVertical: 12,
        marginHorizontal: 32,
        borderRadius: 12,
        overflow: 'hidden',
        // elevation: 1,
    },
    loginButton: {
        position: 'absolute',
        backgroundColor: '#AFD34D',
        borderRadius: 25,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 48,
        bottom: 12
    },
    buttonText: {
        alignSelf: "center",
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageUploadContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'white',
        maxWidth: '100%'
    },
    imageScrollView: {
        flex: 1,
        maxWidth: '100%',
    },
    imageUploadContainerOuter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        backgroundColor: 'white',
        // width: '100%',
        height: 144,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 6,
        padding: 12
    },
    cameraButton: {
        width: 120,
        height: 120,
        backgroundColor: '#EDEDED',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        marginRight: 12,
    },
    uploadedImage: {
        width: 120,
        height: 120,
        borderRadius: 6
    },
    input: {
        width: '100%',
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 6,
        marginBottom: 12,
        marginTop: 12,
        backgroundColor: 'white'
    },
    multiline: {
        textAlignVertical: 'top',
        minHeight: 156
    },
    InputTXT: {
        fontSize: 24,
        marginBottom: 10,
        alignSelf: "flex-start",
        left: 5
    },
    InputTXTExtra: {
        fontSize: 15,
        marginTop: -10,
        alignSelf: "flex-start",
        left: 5,
        color: '#989898'
    },
    materialTXT: {
        padding: 10,
    },
    materialTXTInner: {
        padding: 4,
        fontWeight: 'bold',
    },
    removeButton: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        top: 6,
        right: 6,
        backgroundColor: '#333333'
    }
});

export default PickUpScreenFinalStep;
