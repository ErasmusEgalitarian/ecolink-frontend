import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import OverviewPickupCards from "../components/OverviewPickupCards";
import OverviewDonationCards from "../components/OverviewDonationCards";

const ScheduledPickUpScreen = () => {
    const { t } = useTranslation();
    const [selectedPill, setSelectedPill] = useState(t('Overview.donation'));
    const [pickupData, setPickupData] = useState([]);
    const [donationData, setDonationData] = useState([]);

    // wait for endpoint to exist..
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:3000/api/overviewData');
    //             const data = await response.json();
    //
    //             const pickup = data.map(item => ({
    //                 name: item.name,
    //                 phoneNumber: item.phoneNumber,
    //             }));
    //
    //             const donation = data.map(item => ({
    //                 amount: item.amount,
    //                 materialType: item.materialType,
    //                 location: item.location,
    //             }));
    //
    //             setPickupData(pickup);
    //             setDonationData(donation);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //
    //     fetchData();
    // }, []);

    const renderSelectedComponent = () => {
        if (selectedPill === t('Overview.donation')) {
            return <OverviewDonationCards data={donationData} />;
        } else {
            return <OverviewPickupCards data={pickupData} />;
        }
    };

    return (
        <View style={styles.parent}>
            <View style={styles.container}>
                <View style={styles.containerPills}>
                    {[t('Overview.donation'), t('Overview.pickup')].map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.pillButtons,
                                selectedPill === item && styles.selectedPill
                            ]}
                            onPress={() => setSelectedPill(item)}
                        >
                            <Text style={selectedPill === item ? styles.selectedPillText : styles.pillText}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                
                {/* Mockup Donations */}
                {renderSelectedComponent()}
                {renderSelectedComponent()}
                {renderSelectedComponent()}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        width: '100%',
    },
    container: {
        flex: 1,
        marginVertical: 12,
        marginHorizontal: 32,
        // borderRadius: 12,
        overflow: 'hidden',
        // backgroundColor: '#FFFFFF',
        // padding: 12,
        // elevation: 1,
    },
    containerPills: {
        flexDirection: "row",
        justifyContent: 'space-between',
        width: "100%",
        marginBottom: 24
    },
    pillButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 25,
        width: '45%',
        height: 36,
        elevation: 1,
    },
    pillText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'medium',
    },
    selectedPill: {
        backgroundColor: '#AFD34D'
    },
    selectedPillText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ScheduledPickUpScreen;