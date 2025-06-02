import React, { useLayoutEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MediaListScreen from '../screens/MediaListScreen';
import MediaUploadScreen from '../screens/MediaUploadScreen';

const MediaStack = createNativeStackNavigator();

function MediaStackNavigator({navigation}) {

    useLayoutEffect(() => {
            navigation.setOptions({
            title: 'Feed',
        });
    }, [navigation]);

    return (
        <MediaStack.Navigator>
        <MediaStack.Screen 
            name="MediaList" 
            component={MediaListScreen} 
            options={{ headerShown: false }} 
        />
        <MediaStack.Screen 
            name="MediaUpload" 
            component={MediaUploadScreen} 
            options={{ headerShown: true, title: 'Upload de Mídia' }} 
        />
        </MediaStack.Navigator>
    );
}

export default MediaStackNavigator;
