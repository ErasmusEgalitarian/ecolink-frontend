import React from 'react';
import { render } from '@testing-library/react-native';
import OverviewScreen from '../screens/OverviewScreen';

test('renders the OverviewScreen correctly', () => {
    const { getByText } = render(<OverviewScreen />);

    // Check if the "Welkom" text is rendered
    expect(getByText('Test Placeholder')).toBeTruthy();
});
