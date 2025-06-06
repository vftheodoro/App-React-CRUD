import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CarDetailsScreen({ route, navigation }) {
  const { car } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  if (!car) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 18 }}>Carro não encontrado.</Text>
      </View>
    );
  }

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesArray = favorites ? JSON.parse(favorites) : [];
      if (isFavorite) {
        favoritesArray = favoritesArray.filter(id => id !== car.id);
      } else {
        favoritesArray.push(car.id);
      }
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  React.useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorites = await AsyncStorage.getItem('favorites');
        const favoritesArray = favorites ? JSON.parse(favorites) : [];
        setIsFavorite(favoritesArray.includes(car.id));
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
    checkFavorite();
  }, [car.id]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#e74c3c' : '#666'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: car.image_url }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.carName}>{car.name}</Text>
        <Text style={styles.carBrand}>{car.brand}</Text>
        <Text style={styles.carPrice}>R$ {parseFloat(car.price).toLocaleString('pt-BR')}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{car.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
          <View style={styles.specsGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Motor</Text>
              <Text style={styles.specValue}>{car.engine}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Potência</Text>
              <Text style={styles.specValue}>{car.power}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Torque</Text>
              <Text style={styles.specValue}>{car.torque}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Transmissão</Text>
              <Text style={styles.specValue}>{car.transmission}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Aceleração</Text>
              <Text style={styles.specValue}>{car.acceleration}</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Velocidade Máxima</Text>
              <Text style={styles.specValue}>{car.top_speed}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  carImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  carName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  carBrand: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  carPrice: {
    fontSize: 20,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginTop: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  specItem: {
    width: '50%',
    padding: 8,
  },
  specLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
  },
}); 