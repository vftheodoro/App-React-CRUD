import React, { useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';

export default function FavoritesScreen({ navigation }) {
  const [favoriteCars, setFavoriteCars] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      if (favoritesArray.length === 0) {
        setFavoriteCars([]);
        setLoading(false);
        return;
      }
      // Busca todos os carros da API
      const response = await fetch(`${API_URL}/cars.php`);
      const allCars = await response.json();
      // Filtra apenas os favoritos
      const favoriteCarsList = allCars.filter(car => favoritesArray.includes(car.id.toString()));
      setFavoriteCars(favoriteCarsList);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.carCard}
      onPress={() => navigation.navigate('CarDetails', { car: item })}
    >
      <Image
        source={{ uri: item.image_url || 'https://via.placeholder.com/100x80?text=No+Image' }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{item.name}</Text>
        <Text style={styles.carBrand}>{item.brand}</Text>
        <Text style={styles.carPrice}>R$ {parseFloat(item.price).toLocaleString('pt-BR')}</Text>
        <View style={styles.carSpecs}>
          <Text style={styles.carYear}>{item.year}</Text>
          <Text style={styles.carPower}>{item.power}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (favoriteCars.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart-outline" size={64} color="#666" />
        <Text style={styles.emptyText}>Nenhum carro favorito ainda</Text>
        <Text style={styles.emptySubText}>
          Adicione carros aos favoritos para vê-los aqui
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteCars}
        renderItem={renderCarItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
  },
  carInfo: {
    flex: 1,
    marginLeft: 12,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  carBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  carPrice: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginTop: 4,
  },
  carSpecs: {
    flexDirection: 'row',
    marginTop: 4,
  },
  carYear: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  carPower: {
    fontSize: 12,
    color: '#666',
  },
}); 