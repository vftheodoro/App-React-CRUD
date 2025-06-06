import { Platform } from 'react-native';

export const colors = {
  // Cores principais
  primary: '#2ecc71',
  secondary: '#1a1a1a',
  background: '#f5f5f5',
  surface: '#ffffff',
  
  // Cores de texto
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#ffffff',
  },
  
  // Estados
  error: '#e74c3c',
  success: '#2ecc71',
  warning: '#f1c40f',
  info: '#3498db',
  
  // Acessibilidade
  focus: '#3498db',
  overlay: 'rgba(0,0,0,0.5)',
};

export const typography = {
  // Tamanhos de fonte
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  
  // Pesos
  weights: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
  
  // Espaçamento
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    loose: 1.8,
  },

  // Fontes
  fonts: {
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
    }),
    bold: Platform.select({
      ios: 'System-Bold',
      android: 'Roboto-Bold',
    }),
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.37,
    shadowRadius: 7.49,
    elevation: 6,
  },
};

export const accessibility = {
  // Tamanhos mínimos para toque
  touchTarget: {
    minHeight: 44,
    minWidth: 44,
  },
  
  // Contraste mínimo
  contrast: {
    normal: 4.5,
    large: 3,
  },
  
  // Espaçamento para texto
  textSpacing: {
    letterSpacing: 0.5,
    lineHeight: typography.lineHeight.normal,
  },
};

export const breakpoints = {
  mobile: 768,
  tablet: 1024,
};

// Função helper para verificar breakpoints
export const isTablet = (width) => width >= breakpoints.mobile && width < breakpoints.tablet;
export const isDesktop = (width) => width >= breakpoints.tablet;

// Função helper para calcular tamanhos responsivos
export const responsiveSize = (mobile, tablet, desktop) => {
  return (width) => {
    if (isDesktop(width)) return desktop;
    if (isTablet(width)) return tablet;
    return mobile;
  };
};

// Função helper para calcular espaçamento responsivo
export const responsiveSpacing = (base) => {
  return (width) => {
    if (isDesktop(width)) return base * 1.5;
    if (isTablet(width)) return base * 1.25;
    return base;
  };
};

export default {
  colors,
  typography,
  spacing,
  shadows,
  accessibility,
  breakpoints,
  isTablet,
  isDesktop,
  responsiveSize,
  responsiveSpacing,
}; 