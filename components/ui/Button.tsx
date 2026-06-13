import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, View, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Theme } from '../../constants/Theme';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiaire' | 'demasquer' | 'annuler' | 'outline';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: ButtonVariant;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  onPress,
  title,
  variant = 'primary',
  icon,
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  
  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getVariantStyles = (): { button: ViewStyle; text: TextStyle; iconColor: string } => {
    switch (variant) {
      case 'primary': // BOUTON PRINCIPAL (Red/Dark Red)
        return {
          button: {
            backgroundColor: Theme.colors.red,
            borderColor: Theme.colors.red,
            borderWidth: 1,
          },
          text: {
            color: Theme.colors.text.light,
          },
          iconColor: Theme.colors.text.light,
        };
      case 'secondary': // BOUTON SECONDAIRE (Dark Grey)
        return {
          button: {
            backgroundColor: Theme.colors.border,
            borderColor: Theme.colors.text.muted,
            borderWidth: 1,
          },
          text: {
            color: Theme.colors.text.light,
          },
          iconColor: Theme.colors.text.light,
        };
      case 'tertiaire': // BOUTON TERTIAIRE (Transparent / Subtle Grey outline)
        return {
          button: {
            backgroundColor: 'rgba(42, 42, 42, 0.3)',
            borderColor: 'rgba(242, 232, 207, 0.2)',
            borderWidth: 1,
          },
          text: {
            color: 'rgba(242, 232, 207, 0.7)',
          },
          iconColor: 'rgba(242, 232, 207, 0.7)',
        };
      case 'demasquer': // DÉMASQUER (Bordeaux/Dark Red)
        return {
          button: {
            backgroundColor: Theme.colors.red,
            borderColor: Theme.colors.red,
            borderWidth: 1,
          },
          text: {
            color: Theme.colors.text.light,
          },
          iconColor: Theme.colors.text.light,
        };
      case 'annuler': // ANNULER (Dark black/grey, low emphasis)
        return {
          button: {
            backgroundColor: '#151515',
            borderColor: '#222222',
            borderWidth: 1,
          },
          text: {
            color: Theme.colors.text.muted,
          },
          iconColor: Theme.colors.text.muted,
        };
      case 'outline': // OUTLINE
        return {
          button: {
            backgroundColor: 'transparent',
            borderColor: Theme.colors.paper,
            borderWidth: 1.5,
          },
          text: {
            color: Theme.colors.text.light,
          },
          iconColor: Theme.colors.text.light,
        };
      default:
        return {
          button: {
            backgroundColor: Theme.colors.red,
          },
          text: {
            color: Theme.colors.text.light,
          },
          iconColor: Theme.colors.text.light,
        };
    }
  };

  const variantStyle = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.8}
      style={[
        styles.button,
        variantStyle.button,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      <View style={styles.contentContainer}>
        {icon && (
          <Ionicons
            name={icon}
            size={32}
            color={disabled ? 'rgba(242, 232, 207, 0.3)' : variantStyle.iconColor}
            style={styles.icon}
          />
        )}
        <Text
          style={[
            styles.text,
            variantStyle.text,
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    width: '100%',
    marginVertical: 6,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'BebasNeue-Bold',
    fontSize: 26,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  disabledButton: {
    backgroundColor: '#1A1A1A',
    borderColor: '#2A2A2A',
    opacity: 0.6,
  },
  disabledText: {
    color: 'rgba(242, 232, 207, 0.3)',
  },
});
