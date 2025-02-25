import React, { useEffect, useRef, useState } from 'react';
import { View, Alert, PermissionsAndroid, Platform, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { Ionicons } from '@expo/vector-icons';

MapboxGL.setAccessToken('pk.eyJ1IjoiYXJ0aHVyZWlybyIsImEiOiJjbTN5cThoYWIwNmR5Mmxwc2JycWk0MTZ3In0.TpefDaU409Q7JcPMOPo2Eg');

const LATITUDE = -15.793889; // Latitude de Brasília
const LONGITUDE = -47.882778; // Longitude de Brasília

const BRASILIA_REGION = {
    id: 'brasilia',
    name: 'Brasília',
    minZoom: 10,
    maxZoom: 16,
    styleURL: 'mapbox://styles/arthureiro/cm5q2ye8b001q01rsen4h0w37',
    bounds: [
        [-48.2, -16.3], // Oeste, Sul (canto sudoeste)
        [-47.5, -15.3], // Leste, Norte (canto nordeste)
    ],
};

const MapComponent = ({ style, showSearchAndPin = false, onLocationSelected }) => {
    const mapRef = useRef(null);
    const cameraRef = useRef(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [centerCoords, setCenterCoords] = useState([LONGITUDE, LATITUDE]);

    // Solicita permissão do uso da localização
    const requestLocationPermission = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: "Permissão de Localização",
                    message: "Precisamos da sua localização para mostrar o mapa corretamente.",
                    buttonNeutral: "Perguntar depois",
                    buttonNegative: "Cancelar",
                    buttonPositive: "OK",
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true; // No iOS, se a chave estiver no Info.plist (está configurado pelo app.js, na chave 'ios'), a permissão será solicitada automaticamente
    };

    // Obtem a localização do usuário
    const getUserLocation = async () => {
        try {
            const lastLocation = await MapboxGL.locationManager.getLastKnownLocation();
            if (lastLocation && lastLocation.coords) {
                const { latitude, longitude } = lastLocation.coords;
                setUserCoords([longitude, latitude]);
            } else {
                setUserCoords(null);
            }
        } catch (error) {
            console.log(error);
            setUserCoords(null);
        }
    };

    // Centraliza a câmera
    const handleCenterCamera = async () => {
        await getUserLocation();
        const coords = permissionGranted && userCoords ? userCoords : [LONGITUDE, LATITUDE];
        cameraRef.current?.setCamera({
            centerCoordinate: coords,
            zoomLevel: permissionGranted && userCoords ? 15 : 11,
            duration: 500,
        });
    };

    const handleSearchSubmit = async () => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=pk.eyJ1IjoiYXJ0aHVyZWlybyIsImEiOiJjbTN5cThoYWIwNmR5Mmxwc2JycWk0MTZ3In0.TpefDaU409Q7JcPMOPo2Eg`
            );
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                const { center } = data.features[0];
                setCenterCoords(center);
                mapRef.current.setCamera({
                    centerCoordinate: center,
                    zoomLevel: 14,
                    duration: 1000,
                });
            } else {
                Alert.alert('Location not found', 'Please try another search term.');
            }
        } catch (error) {
            console.error('Error during search:', error);
            Alert.alert('Error', 'Unable to search for location.');
        }
    };

    useEffect(() => {
        (async () => {
            const hasPermission = await requestLocationPermission();
            if (hasPermission) {
                setPermissionGranted(true);
                MapboxGL.locationManager.start(); // Inicia a atualização de localização do Mapbox
                getUserLocation();
            } else {
                Alert.alert("Permissão Negada", "Não foi possível obter sua localização.");
            }
        })();
    }, []);

    return (
        <View style={[styles.container, style]}>
            {showSearchAndPin && (
                <>
                    {/* Campo de busca */}
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a location..."
                        value={searchText}
                        onChangeText={setSearchText}
                        onSubmitEditing={handleSearchSubmit}
                    />

                    {/* Ícone fixo */}
                    <View style={styles.centerIconContainer}>
                        <Ionicons name="pin" size={36} color="#333333" />
                    </View>
                </>
            )}

            <MapboxGL.MapView
                style={styles.map}
                ref={mapRef}
                styleURL={BRASILIA_REGION.styleURL}
                localizeLabels={true}
                zoomEnabled={true}
                scrollEnabled={true}
                pitchEnabled={false}
                rotateEnabled={false}
                minZoomLevel={BRASILIA_REGION.minZoom}
                maxZoomLevel={BRASILIA_REGION.maxZoom}
                logoEnabled={false}
                scaleBarEnabled={false}
                onRegionDidChange={() => {
                    mapRef.current?.getCenter().then(setCenterCoords);
                }}
            >
                {permissionGranted && <MapboxGL.UserLocation visible={true} />}
                <MapboxGL.Camera
                    ref={cameraRef}
                    centerCoordinate={centerCoords}
                    zoomLevel={15}
                    minZoomLevel={BRASILIA_REGION.minZoom}
                    maxZoomLevel={BRASILIA_REGION.maxZoom}
                />
            </MapboxGL.MapView>

            {showSearchAndPin && (
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => {
                        if (onLocationSelected) {
                            onLocationSelected(centerCoords);
                        }
                    }}
                >
                    <Ionicons name="checkmark" size={32} color="white" />
                </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.centerCameraButton, {top: showSearchAndPin ? 100 : 36}]} onPress={handleCenterCamera}>
                <Ionicons name="locate" size={24} color="#14213D" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 1,
    },
    map: {
        flex: 1,
    },
    centerCameraButton: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 36,
        right: 24,
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: 'white',
        zIndex: 1,
    },
    searchInput: {
        position: 'absolute',
        top: 12,
        left: 12,
        right: 12,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 100,
        fontSize: 16,
        zIndex: 1,
        height: 48
    },
    centerIconContainer: {
        position: 'absolute',
        top: '48%',
        left: '50%',
        transform: [{ translateX: -18 }, { translateY: -18 }],
        zIndex: 1,
    },
    continueButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        backgroundColor: '#AFD34D',
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
});

export default MapComponent;