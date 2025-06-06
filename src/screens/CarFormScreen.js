import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList
} from 'react-native';
import { API_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Lista de marcas brasileiras e populares nacionais (ordenada)
const POPULAR_BRANDS = [
  'Agrale', 'Alfa Romeo', 'BMW', 'Chevrolet', 'Chrysler', 'Citroën', 'DKW',
  'Dodge', 'Fiat', 'Ford', 'Gurgel', 'Honda', 'Hyundai', 'Jeep', 'Karmann-Ghia',
  'Mercedes-Benz', 'Miura', 'Opel', 'Pagani', 'Peugeot', 'Puma', 'Renault',
  'Santa Matilde', 'Simca', 'Suzuki', 'Toyota', 'Troller', 'Volkswagen', 'Willys'
];

// Mapeamento de ícones das marcas (usando Ionicons ou imagens externas)
const BRAND_ICONS = {
  'Volkswagen': 'car-sport-outline',
  'Chevrolet': 'car-outline',
  'Fiat': 'car-outline',
  'Ford': 'car-outline',
  'Renault': 'car-outline',
  'Peugeot': 'car-outline',
  'Citroën': 'car-outline',
  'Toyota': 'car-outline',
  'Honda': 'car-outline',
  'Hyundai': 'car-outline',
  'Jeep': 'car-outline',
  'Dodge': 'car-outline',
  'Gurgel': 'car-outline',
  'Willys': 'car-outline',
  'Simca': 'car-outline',
  'DKW': 'car-outline',
  'Puma': 'car-outline',
  'Santa Matilde': 'car-outline',
  'Miura': 'car-outline',
  'Agrale': 'car-outline',
  'Troller': 'car-outline',
  'Suzuki': 'car-outline',
  'Chrysler': 'car-outline',
  'Mercedes-Benz': 'car-outline',
  'BMW': 'car-outline',
  'Karmann-Ghia': 'car-outline',
  'Alfa Romeo': 'car-outline',
  'Opel': 'car-outline',
  'Pagani': 'car-outline',
};

// Validação de URL
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

// Formatação de preço
const formatPrice = (value) => {
  const numericValue = value.replace(/\D/g, '');
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

// Componente de Input Animado
const AnimatedInput = ({ label, value, onChangeText, error, ...props }) => {
  const [focused, setFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: focused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 8],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: error ? '#e74c3c' : focused ? '#2ecc71' : '#999',
    backgroundColor: '#fff',
    paddingHorizontal: 4,
    zIndex: 1,
  };

  return (
    <View style={styles.animatedInputContainer}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={[
          styles.animatedInput,
          focused && styles.animatedInputFocused,
          error && styles.animatedInputError
        ]}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Componente de Seleção de Marca
const BrandSelector = ({ value, onSelect, error }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBrands = POPULAR_BRANDS.filter(brand =>
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectBrand = (brand) => {
    onSelect(brand);
    setModalVisible(false);
    setSearchQuery('');
  };

  return (
    <View style={styles.animatedInputContainer}>
      <Text style={[styles.inputLabel, error && { color: '#e74c3c' }]}>Marca *</Text>
      <TouchableOpacity
        style={[styles.brandSelector, error && styles.animatedInputError]}
        onPress={() => setModalVisible(true)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {value && (
            <Ionicons name={BRAND_ICONS[value] || 'car-outline'} size={20} color="#2ecc71" style={{ marginRight: 8 }} />
          )}
          <Text style={[styles.brandSelectorText, !value && styles.placeholder]}>
            {value || 'Selecionar marca'}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color="#999" />
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Marca</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#999" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar marca..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <FlatList
            data={filteredBrands}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.brandItem}
                onPress={() => selectBrand(item)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={BRAND_ICONS[item] || 'car-outline'} size={20} color="#2ecc71" style={{ marginRight: 8 }} />
                  <Text style={styles.brandItemText}>{item}</Text>
                </View>
                {value === item && (
                  <Ionicons name="checkmark" size={20} color="#2ecc71" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Componente de Preview de Imagem
const ImagePreview = ({ uri, onRetry }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <View style={styles.imagePreviewContainer}>
      <Text style={styles.inputLabel}>Preview da Imagem</Text>
      {uri && isValidUrl(uri) ? (
        <View style={styles.imageWrapper}>
          {loading && (
            <View style={styles.imageLoading}>
              <ActivityIndicator color="#2ecc71" />
              <Text style={styles.imageLoadingText}>Carregando...</Text>
            </View>
          )}
          <Image
            source={{ uri }}
            style={styles.imagePreview}
            onLoad={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          />
          {error && (
            <View style={styles.imageError}>
              <Ionicons name="image-outline" size={40} color="#999" />
              <Text style={styles.imageErrorText}>Erro ao carregar imagem</Text>
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
          <Text style={styles.imagePlaceholderText}>
            Insira uma URL válida para ver o preview
          </Text>
        </View>
      )}
    </View>
  );
};

export default function CarFormScreen({ route, navigation }) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [car, setCar] = useState({
    name: '',
    brand: '',
    year: '',
    price: '',
    image_url: '',
    description: '',
    engine: '',
    power: '',
    torque: '',
    transmission: '',
    acceleration: '',
    top_speed: ''
  });
  const [errors, setErrors] = useState({});
  const [showImagePreview, setShowImagePreview] = useState(false);
  
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isEditing = route.params?.car;

  const steps = [
    { title: 'Básico', icon: 'car-outline' },
    { title: 'Detalhes', icon: 'document-text-outline' },
    { title: 'Técnico', icon: 'settings-outline' }
  ];

  useEffect(() => {
    if (isEditing) {
      setCar(route.params.car);
    }
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isEditing]);

  const validate = () => {
    let newErrors = {};
    
    // Validação básica
    if (!car.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!car.brand.trim()) newErrors.brand = 'Marca é obrigatória';
    if (!car.year) newErrors.year = 'Ano é obrigatório';
    else if (car.year < 1900 || car.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Ano inválido';
    }
    if (!car.price) newErrors.price = 'Preço é obrigatório';
    if (!car.image_url.trim()) newErrors.image_url = 'URL da imagem é obrigatória';
    else if (!isValidUrl(car.image_url)) {
      newErrors.image_url = 'URL inválida';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Erro', 'Por favor, corrija os campos destacados');
      return;
    }
    
    setLoading(true);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = `${API_URL}/cars.php${isEditing ? `/${car.id}` : ''}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...car,
          price: car.price.replace(/\D/g, ''), // Remove formatação
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        Alert.alert(
          'Sucesso! 🎉',
          isEditing ? 'Carro atualizado com sucesso!' : 'Carro cadastrado com sucesso!',
          [{ 
            text: 'OK', 
            onPress: () => navigation.goBack(),
            style: 'default'
          }]
        );
      } else {
        throw new Error(data.error || 'Erro ao salvar carro');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (text) => {
    const formatted = formatPrice(text);
    setCar({ ...car, price: formatted });
  };

  const scrollToStep = (step) => {
    setCurrentStep(step);
    const yOffset = step * 200; // Aproximadamente
    scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
  };

  const retryImageLoad = () => {
    // Força um reload da imagem
    setShowImagePreview(false);
    setTimeout(() => setShowImagePreview(true), 100);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Step Indicator */}
      <View style={styles.stepContainer}>
        {steps.map((step, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.stepItem,
              index === currentStep && styles.stepItemActive
            ]}
            onPress={() => scrollToStep(index)}
          >
            <View style={[
              styles.stepIcon,
              index === currentStep && styles.stepIconActive
            ]}>
              <Ionicons 
                name={step.icon} 
                size={16} 
                color={index === currentStep ? '#fff' : '#2ecc71'} 
              />
            </View>
            <Text style={[
              styles.stepText,
              index === currentStep && styles.stepTextActive
            ]}>
              {step.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
          
          {/* Seção 1: Informações Básicas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="car-outline" size={20} color="#2ecc71" />
              <Text style={styles.sectionTitle}>Informações Básicas</Text>
            </View>

            <AnimatedInput
              label="Nome do Carro *"
              value={car.name}
              onChangeText={(text) => setCar({ ...car, name: text })}
              error={errors.name}
              placeholder="Ex: Fusca 1300"
              autoCapitalize="words"
            />

            <BrandSelector
              value={car.brand}
              onSelect={(brand) => setCar({ ...car, brand })}
              error={errors.brand}
            />

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Ano *"
                  value={car.year.toString()}
                  onChangeText={(text) => setCar({ ...car, year: text })}
                  error={errors.year}
                  keyboardType="numeric"
                  placeholder="Ex: 1975"
                  maxLength={4}
                />
              </View>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Preço (R$) *"
                  value={car.price}
                  onChangeText={handlePriceChange}
                  error={errors.price}
                  keyboardType="numeric"
                  placeholder="3.500.000"
                />
              </View>
            </View>

            <AnimatedInput
              label="URL da Imagem *"
              value={car.image_url}
              onChangeText={(text) => {
                setCar({ ...car, image_url: text });
                setShowImagePreview(!!text);
              }}
              error={errors.image_url}
              placeholder="https://exemplo.com/imagem.jpg"
              autoCapitalize="none"
              keyboardType="url"
            />

            {showImagePreview && car.image_url && (
              <ImagePreview uri={car.image_url} onRetry={retryImageLoad} />
            )}
          </View>

          {/* Seção 2: Descrição */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#2ecc71" />
              <Text style={styles.sectionTitle}>Descrição</Text>
            </View>

            <View style={styles.textAreaContainer}>
              <Text style={styles.inputLabel}>Descrição do Carro</Text>
              <TextInput
                style={styles.textArea}
                value={car.description}
                onChangeText={(text) => setCar({ ...car, description: text })}
                multiline
                numberOfLines={4}
                placeholder="Ex: Clássico brasileiro, muito popular nos anos 70 e 80."
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {car.description.length}/500
              </Text>
            </View>
          </View>

          {/* Seção 3: Especificações Técnicas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="settings-outline" size={20} color="#2ecc71" />
              <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Motor"
                  value={car.engine}
                  onChangeText={(text) => setCar({ ...car, engine: text })}
                  placeholder="Ex: 1.3 Boxer"
                />
              </View>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Potência"
                  value={car.power}
                  onChangeText={(text) => setCar({ ...car, power: text })}
                  placeholder="Ex: 46 cv"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Torque"
                  value={car.torque}
                  onChangeText={(text) => setCar({ ...car, torque: text })}
                  placeholder="770 Nm"
                />
              </View>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Transmissão"
                  value={car.transmission}
                  onChangeText={(text) => setCar({ ...car, transmission: text })}
                  placeholder="7 marchas"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Aceleração"
                  value={car.acceleration}
                  onChangeText={(text) => setCar({ ...car, acceleration: text })}
                  placeholder="2.9s (0-100 km/h)"
                />
              </View>
              <View style={styles.halfWidth}>
                <AnimatedInput
                  label="Velocidade Máxima"
                  value={car.top_speed}
                  onChangeText={(text) => setCar({ ...car, top_speed: text })}
                  placeholder="340 km/h"
                />
              </View>
            </View>
          </View>

          {/* Botão de Submit */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loadingText}>Salvando...</Text>
              </View>
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>
                  {isEditing ? 'Atualizar Carro' : 'Cadastrar Carro'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  formContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  animatedInputContainer: {
    marginBottom: 16,
  },
  animatedInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    color: '#1a1a1a',
  },
  animatedInputFocused: {
    borderColor: '#2ecc71',
    backgroundColor: '#fff',
  },
  animatedInputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fff5f5',
  },
  inputLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '500',
  },
  brandSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  brandSelectorText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  placeholder: {
    color: '#999',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    fontSize: 16,
  },
  brandItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  brandItemText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 8,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  textArea: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  imagePreviewContainer: {
    marginTop: 16,
  },
  imageWrapper: {
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  imageLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    zIndex: 1,
  },
  imageLoadingText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
  },
  imageError: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  imageErrorText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#999',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#95a5a6',
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  stepItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  stepItemActive: {
    backgroundColor: '#2ecc71',
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e8f5e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  stepIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stepText: {
    fontSize: 12,
    color: '#2ecc71',
    fontWeight: '500',
  },
  stepTextActive: {
    color: '#fff',
  },
});