import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, accessibility } from '../../theme';

const AccessibleInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  autoCorrect,
  multiline,
  numberOfLines,
  maxLength,
  accessibilityLabel,
  accessibilityHint,
  testID,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  onBlur,
  onFocus,
  editable = true,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getBorderColor = () => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.text.disabled;
  };

  const getBackgroundColor = () => {
    if (!editable) return colors.background;
    return colors.surface;
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.label,
              { color: error ? colors.error : colors.text.primary },
              labelStyle,
            ]}
            accessibilityRole="text"
          >
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          accessibilityLabel={accessibilityLabel || label}
          accessibilityHint={accessibilityHint}
          accessibilityRole="textbox"
          accessibilityState={{ disabled: !editable }}
          testID={testID}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.visibilityToggle}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={24}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text
          style={[styles.error, errorStyle]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fonts.medium,
    color: colors.text.primary,
    ...accessibility.textSpacing,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    minHeight: accessibility.touchTarget.minHeight,
    paddingHorizontal: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fonts.regular,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    ...Platform.select({
      ios: {
        paddingVertical: spacing.xs,
      },
    }),
    ...accessibility.textSpacing,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  visibilityToggle: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  error: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
    fontFamily: typography.fonts.regular,
  },
});

export default AccessibleInput; 