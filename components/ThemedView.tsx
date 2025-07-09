import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  card?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, card = false, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const cardStyle = card
    ? {
        borderRadius: 16,
        backgroundColor: useThemeColor({ light: undefined, dark: undefined }, 'card'),
        shadowColor: useThemeColor({ light: undefined, dark: undefined }, 'cardShadow'),
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
      }
    : {};
  return <View style={[{ backgroundColor }, cardStyle, style]} {...otherProps} />;
}
