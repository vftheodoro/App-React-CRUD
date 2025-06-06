import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  AccessibilityInfo,
  Platform,
  View
} from 'react-native';
import { colors, typography, spacing, accessibility } from '../../theme';

const AccessibleButton = ({
  onPress,
  label,
  accessibilityLabel,
  accessibilityHint,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  style,
  textStyle,
  testID,
}) => {
  // Determina o estilo baseado na variante
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: colors.primary,
        };
    }
  };

  // Determina o tamanho do botão
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.xs,
          paddingHorizontal: spacing.sm,
        };
      case 'large':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        };
      default:
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        };
    }
  };

  // Determina a cor do texto baseado na variante
  const getTextColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.primary;
      case 'text':
        return colors.primary;
      default:
        return colors.text.inverse;
    }
  };

  // Determina o tamanho do texto baseado no tamanho do botão
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return typography.sizes.sm;
      case 'large':
        return typography.sizes.lg;
      default:
        return typography.sizes.md;
    }
  };

  const buttonStyles = [
    styles.button,
    getVariantStyle(),
    getSizeStyle(),
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    {
      color: getTextColor(),
      fontSize: getTextSize(),
    },
    disabled && styles.disabledText,
    textStyle,
  ];

  // Configuração de acessibilidade
  const accessibilityConfig = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: accessibilityLabel || label,
    accessibilityHint: accessibilityHint,
    accessibilityState: { disabled },
    accessibilityActions: [
      { name: 'activate', label: 'Ativar botão' },
    ],
    onAccessibilityAction: ({ nativeEvent: { actionName } }) => {
      if (actionName === 'activate' && !disabled) {
        onPress();
      }
    },
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={buttonStyles}
      activeOpacity={0.7}
      {...accessibilityConfig}
      testID={testID}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={textStyles}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    minHeight: accessibility.touchTarget.minHeight,
    minWidth: accessibility.touchTarget.minWidth,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: typography.fonts.medium,
    textAlign: 'center',
    ...accessibility.textSpacing,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: colors.text.disabled,
    borderColor: colors.text.disabled,
  },
  disabledText: {
    color: colors.text.inverse,
  },
});

export default AccessibleButton; 