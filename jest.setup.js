jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper', () => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
}), { virtual: true });

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
