import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X)
const baseWidth = 375;
const baseHeight = 812;

// Responsive functions
export const responsiveWidth = (size) => {
  const scale = SCREEN_WIDTH / baseWidth;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

export const responsiveHeight = (size) => {
  const scale = SCREEN_HEIGHT / baseHeight;
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

export const responsiveFontSize = (size) => {
  const scale = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);
  return Math.ceil(PixelRatio.roundToNearestPixel(size * scale));
};

// Device type detection
export const isTablet = () => {
  const pixelDensity = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelDensity;
  const adjustedHeight = SCREEN_HEIGHT * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else if (pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)) {
    return true;
  } else {
    return false;
  }
};

export const isSmallDevice = () => {
  return SCREEN_WIDTH < 375;
};

export const isLargeDevice = () => {
  return SCREEN_WIDTH > 414;
};

// Responsive spacing
export const getResponsiveSpacing = (size) => {
  if (isTablet()) {
    return responsiveWidth(size * 1.2);
  } else if (isLargeDevice()) {
    return responsiveWidth(size * 1.1);
  } else if (isSmallDevice()) {
    return responsiveWidth(size * 0.9);
  }
  return responsiveWidth(size);
};

// Screen dimensions
export const screenData = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isTablet: isTablet(),
  isSmallDevice: isSmallDevice(),
  isLargeDevice: isLargeDevice(),
};