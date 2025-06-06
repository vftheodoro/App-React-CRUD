import React, { useState, useCallback, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Text, 
  TextInput, 
  Alert, 
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '../config';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // name, price, year
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  const loadCars = async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await fetch(`${API_URL}/cars.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCars(data);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error loading cars:', error);
      Alert.alert('Erro', 'Não foi possível carregar os carros. Verifique sua conexão.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCars();
    }, [])
  );

  // Memoized filtered and sorted cars
  const filteredAndSortedCars = useMemo(() => {
    let filtered = cars;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = cars.filter(car => 
        car.name?.toLowerCase().includes(query) ||
        car.brand?.toLowerCase().includes(query) ||
        car.description?.toLowerCase().includes(query) ||
        car.year?.toString().includes(query)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price) || 0;
          bValue = parseFloat(b.price) || 0;
          break;
        case 'year':
          aValue = parseInt(a.year) || 0;
          bValue = parseInt(b.year) || 0;
          break;
        case 'name':
        default:
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
  }, [cars, searchQuery, sortBy, sortOrder]);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  const handleSort = useCallback((newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  }, [sortBy]);

  const handleDelete = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este carro?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/cars.php?id=${id}`, {
                method: 'DELETE',
              });
              
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              
              const data = await response.json();
              
              if (data.success) {
                Alert.alert('Sucesso', 'Carro excluído com sucesso');
                // Update local state instead of reloading
                setCars(prev => prev.filter(car => car.id !== id));
              } else {
                throw new Error(data.error || 'Erro ao excluir carro');
              }
            } catch (error) {
              console.error('Error deleting car:', error);
              Alert.alert('Erro', error.message || 'Erro ao excluir carro');
            }
          },
        },
      ]
    );
  };

  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'Preço não informado' : 
           `R$ ${numPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  };

  const renderCarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.carCard}
      onPress={() => navigation.navigate('CarDetails', { car: item })}
      activeOpacity={0.7}
    >
      <Image
        source={{ 
          uri: item.image_url || 'https://via.placeholder.com/100x80?text=No+Image'
        }}
        style={styles.carImage}
        resizeMode="cover"
      />
      <View style={styles.carInfo}>
        <Text style={styles.carName} numberOfLines={1}>
          {item.name || 'Nome não informado'}
        </Text>
        <Text style={styles.carBrand} numberOfLines={1}>
          {item.brand || 'Marca não informada'}
        </Text>
        <Text style={styles.carPrice}>
          {formatPrice(item.price)}
        </Text>
        <View style={styles.carSpecs}>
          <Text style={styles.carYear}>
            {item.year || 'Ano N/A'}
          </Text>
          {item.power && (
            <Text style={styles.carPower}>
              {item.power}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('CarForm', { car: item })}
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderSortButton = (sortType, label, icon) => (
    <TouchableOpacity
      style={[
        styles.sortButton,
        sortBy === sortType && styles.activeSortButton
      ]}
      onPress={() => handleSort(sortType)}
      activeOpacity={0.7}
    >
      <Ionicons 
        name={icon} 
        size={16} 
        color={sortBy === sortType ? '#fff' : '#666'} 
      />
      <Text style={[
        styles.sortButtonText,
        sortBy === sortType && styles.activeSortButtonText
      ]}>
        {label}
      </Text>
      {sortBy === sortType && (
        <Ionicons 
          name={sortOrder === 'asc' ? 'chevron-up' : 'chevron-down'} 
          size={14} 
          color="#fff" 
        />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Carregando carros...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar carros..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#666"
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sort Controls */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Ordenar por:</Text>
        <View style={styles.sortButtons}>
          {renderSortButton('name', 'Nome', 'text-outline')}
          {renderSortButton('price', 'Preço', 'cash-outline')}
          {renderSortButton('year', 'Ano', 'calendar-outline')}
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CarForm')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Adicionar Carro</Text>
      </TouchableOpacity>

      {/* Car List or Empty State */}
      {filteredAndSortedCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={searchQuery ? "search-outline" : "car-outline"} 
            size={64} 
            color="#666" 
          />
          <Text style={styles.emptyText}>
            {searchQuery ? 'Nenhum carro encontrado' : 'Nenhum carro cadastrado'}
          </Text>
          <Text style={styles.emptySubText}>
            {searchQuery 
              ? 'Tente buscar por outro termo' 
              : 'Adicione seu primeiro carro usando o botão acima'
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredAndSortedCars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadCars(true)}
              colors={['#2ecc71']}
              tintColor="#2ecc71"
            />
          }
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearButton: {
    padding: 8,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    gap: 4,
  },
  activeSortButton: {
    backgroundColor: '#2ecc71',
    borderColor: '#2ecc71',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#2ecc71',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  separator: {
    height: 8,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#f1f3f4',
  },
  carInfo: {
    flex: 1,
    marginLeft: 16,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  carBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  carPrice: {
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '700',
    marginBottom: 6,
  },
  carSpecs: {
    flexDirection: 'row',
    gap: 12,
  },
  carYear: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  carPower: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#3498db',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
});