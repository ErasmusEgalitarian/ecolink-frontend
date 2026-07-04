import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import OverviewScreen from '../screens/OverviewScreen';
import '../i18n';

test('renders the OverviewScreen correctly', () => {
    const navigation = { navigate: jest.fn() };
    const route = { params: {} };
    const { getByText } = render(
        <NavigationContainer>
            <OverviewScreen navigation={navigation} route={route} />
        </NavigationContainer>
    );

    expect(getByText('Donations')).toBeTruthy();
    expect(getByText('My donations')).toBeTruthy();
});
