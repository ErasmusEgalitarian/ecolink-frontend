jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper', () => ({
    addListener: jest.fn(),
    removeListeners: jest.fn(),
}));
