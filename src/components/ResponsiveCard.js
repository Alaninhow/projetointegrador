import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { spacing } from '../styles/spacing';
import { screenData, getResponsiveSpacing } from '../utils/responsive';

const ResponsiveCard = ({ 
  children, 
  style, 
  padding = 'medium',
  shadow = true,
  borderRadius = 16,
  ...props 
}) => {
  const getPadding = () => {
    switch (padding) {
      case 'small':
        return getResponsiveSpacing(12);
      case 'medium':
        return getResponsiveSpacing(16);
      case 'large':
        return getResponsiveSpacing(20);
      default:
        return getResponsiveSpacing(16);
    }
  };

  const cardStyles = [
    styles.card,
    {
      padding: getPadding(),
      borderRadius: screenData.isTablet ? borderRadius * 1.2 : borderRadius,
    },
    shadow && styles.shadow,
    style,
  ];

  return (
    <View style={cardStyles} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: screenData.isSmallDevice ? spacing[2] : 0,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default ResponsiveCard;