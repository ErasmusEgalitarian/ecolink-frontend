import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import { useTranslation } from 'react-i18next';

const LangChanger = () => {
    const { i18n } = useTranslation();
    const [isEnglish, setIsEnglish] = useState(i18n.language === 'en');

    // Language toggler
    const toggleLanguage = () => {
        const newLang = isEnglish ? 'pt' : 'en';
        i18n.changeLanguage(newLang);
        setIsEnglish(!isEnglish);
    };

    // Switch component to change language
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{isEnglish ? "EN" : "PT"}</Text>
            <Switch
                onValueChange={toggleLanguage}
                value={isEnglish}
                trackColor={{ false: '#0c3a9c', true: '#81b0ff' }}
                thumbColor={isEnglish ? '#86898f' : '#f4f3f4'}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 16,
        marginRight: 5,
    },
});

export default LangChanger;
