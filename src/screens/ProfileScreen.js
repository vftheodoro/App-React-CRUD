import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [totalCars, setTotalCars] = useState(0);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Busca todos os carros
      const response = await fetch(`${API_URL}/cars.php`);
      const allCars = await response.json();
      setTotalCars(Array.isArray(allCars) ? allCars.length : 0);
      // Busca favoritos
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      setTotalFavorites(favoritesArray.length);
    } catch (error) {
      setTotalCars(0);
      setTotalFavorites(0);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Perfil do Usuário</Text>
        <Text style={styles.title}>Bem-vindo ao seu perfil!</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.aboutText}>
          Este é o seu espaço pessoal no app. Aqui você pode acompanhar quantos carros já cadastrou, quantos favoritos possui e acessar informações do seu perfil.
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{loading ? <ActivityIndicator color="#2ecc71" /> : totalCars}</Text>
          <Text style={styles.statLabel}>Carros cadastrados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{loading ? <ActivityIndicator color="#2ecc71" /> : totalFavorites}</Text>
          <Text style={styles.statLabel}>Favoritos</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do Usuário</Text>
        <View style={styles.userInfoRow}>
          <Ionicons name="person-circle-outline" size={20} color="#2ecc71" style={{ marginRight: 8 }} />
          <Text style={styles.userInfoText}>Usuário: <Text style={{ fontWeight: 'bold' }}>@vftheodoro</Text></Text>
        </View>
        <View style={styles.userInfoRow}>
          <Ionicons name="mail-outline" size={20} color="#2ecc71" style={{ marginRight: 8 }} />
          <Text style={styles.userInfoText}>Email: <Text style={{ fontWeight: 'bold' }}>victor.theodoro@email.com</Text></Text>
        </View>
        <View style={styles.userInfoRow}>
          <Ionicons name="calendar-outline" size={20} color="#2ecc71" style={{ marginRight: 8 }} />
          <Text style={styles.userInfoText}>Membro desde: <Text style={{ fontWeight: 'bold' }}>2025</Text></Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Ionicons name="create-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
        <Text style={styles.editButtonText}>Editar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    borderRadius: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    justifyContent: 'space-around',
    borderRadius: 10,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  editButton: {
    backgroundColor: '#2ecc71',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 