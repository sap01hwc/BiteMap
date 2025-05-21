// ...previous imports
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const dummyRestaurants = [
  {
    id: '1',
    name: 'Sushi Hub',
    cuisine: 'Japanese',
    price: '$$',
    rating: 4.5,
    suburb: 'Brisbane City',
    photo: 'https://images.unsplash.com/photo-1598514983171-3a27c0944b1f?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Pasta Point',
    cuisine: 'Italian',
    price: '$$',
    rating: 4.2,
    suburb: 'South Bank',
    photo: 'https://images.unsplash.com/photo-1601924577961-708b7b9e194a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    name: 'Burger Barn',
    cuisine: 'American',
    price: '$',
    rating: 4.7,
    suburb: 'Fortitude Valley',
    photo: 'https://images.unsplash.com/photo-1612874742248-df0b9a2b59a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    name: 'Green Thai',
    cuisine: 'Thai',
    price: '$',
    rating: 4.0,
    suburb: 'West End',
    photo: 'https://images.unsplash.com/photo-1592919428902-9e3d42f8d36f?auto=format&fit=crop&w=800&q=80',
  },
];

const cuisineOptions = {
  Asian: ['Chinese', 'Japanese', 'Korean', 'Malaysian', 'Thai'],
  Western: ['Italian', 'American']
};
const cuisineCategories = Object.entries(cuisineOptions);

const locationOptions = [
  'Brisbane City', 'South Bank', 'West End', 'Fortitude Valley',
  'New Farm', 'Kangaroo Point', 'Woolloongabba', 'Paddington',
  'Milton', 'Toowong', 'Indooroopilly', 'Chermside'
];

const priceOptions = ['$', '$$', '$$$'];
const ratingOptions = ['4.0+', '4.5+'];

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string[]>([]);
  const [expandedCuisineCategories, setExpandedCuisineCategories] = useState<string[]>([]);

  const [activeFilter, setActiveFilter] = useState<null | string>(null);

  const filteredRestaurants = dummyRestaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchText.toLowerCase());

    const matchesCuisine =
      selectedCuisine.length === 0 || selectedCuisine.includes(r.cuisine);

    const matchesPrice =
      selectedPrice.length === 0 || selectedPrice.includes(r.price);

    const matchesRating =
      selectedRating.length === 0 ||
      (selectedRating.includes('4.0+') && r.rating >= 4.0) ||
      (selectedRating.includes('4.5+') && r.rating >= 4.5);

    const matchesLocation =
      selectedLocation.length === 0 || selectedLocation.includes(r.suburb);

    return matchesSearch && matchesCuisine && matchesPrice && matchesRating && matchesLocation;
  });

  const getOptions = () => {
    switch (activeFilter) {
      case 'Cuisine': return cuisineOptions;
      case 'Price': return priceOptions;
      case 'Rating': return ratingOptions;
      case 'Location': return locationOptions;
      default: return [];
    }
  };

  const getSelectedArray = () => {
    switch (activeFilter) {
      case 'Cuisine': return selectedCuisine;
      case 'Price': return selectedPrice;
      case 'Rating': return selectedRating;
      case 'Location': return selectedLocation;
      default: return [];
    }
  };

  const toggleSelection = (stateArray: string[], setter: (value: string[]) => void, option: string) => {
    if (stateArray.includes(option)) {
      setter(stateArray.filter((item) => item !== option));
    } else {
      setter([...stateArray, option]);
    }
  };

  const handleSelect = (option: string) => {
    switch (activeFilter) {
      case 'Cuisine': toggleSelection(selectedCuisine, setSelectedCuisine, option); break;
      case 'Price': toggleSelection(selectedPrice, setSelectedPrice, option); break;
      case 'Rating': toggleSelection(selectedRating, setSelectedRating, option); break;
      case 'Location': toggleSelection(selectedLocation, setSelectedLocation, option); break;
    }
  };

  const clearSelectedFilter = () => {
    switch (activeFilter) {
      case 'Cuisine': setSelectedCuisine([]); break;
      case 'Price': setSelectedPrice([]); break;
      case 'Rating': setSelectedRating([]); break;
      case 'Location': setSelectedLocation([]); break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Brisbane Food Guide</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search restaurants..."
        value={searchText}
        onChangeText={setSearchText}
      />

      <View style={styles.filterBar}>
        {['Cuisine', 'Price', 'Rating', 'Location'].map((filter) => {
          const selectedArray =
            filter === 'Cuisine' ? selectedCuisine :
            filter === 'Price' ? selectedPrice :
            filter === 'Rating' ? selectedRating :
            selectedLocation;

          return (
            <Pressable
              key={filter}
              onPress={() => {
                setActiveFilter(filter);
                setExpandedCuisineCategories([]);
              }}
              style={styles.filterChip}
            >
              <View style={{ alignItems: 'center' }}>
                <Text style={styles.chipText}>{filter}</Text>
                <Text style={styles.selectedText}>
                  {selectedArray.length === 0 ? 'Any' : `${selectedArray.length} selected`}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.photo }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subDetails}>
                {item.cuisine} · {item.price} · {item.suburb}
              </Text>
              <Text style={styles.rating}>⭐ {item.rating}</Text>
            </View>
          </View>
        )}
      />

      <Modal visible={activeFilter !== null} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select {activeFilter}</Text>
            <ScrollView>
              {activeFilter === 'Cuisine' ? (
                cuisineCategories.map(([category, cuisines]) => (
                  <View key={category}>
                    <View style={[styles.optionItemRow, { backgroundColor: '#f0f0f0' }]}> 
                      <TouchableOpacity onPress={() =>
  setExpandedCuisineCategories((prev) =>
    prev.includes(category)
      ? prev.filter((cat) => cat !== category)
      : [...prev, category]
  )
}>
                        <Text style={[styles.optionItemText, { fontWeight: 'bold' }]}>{category}</Text>
                      </TouchableOpacity>
                    </View>
                    {expandedCuisineCategories.includes(category) && cuisines.map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => handleSelect(option)}
                        style={styles.optionItemRow}
                      >
                        <Text style={styles.optionItemText}>{option}</Text>
                        {selectedCuisine.includes(option) && <Text>✓</Text>}
                      </TouchableOpacity>
                    ))}
                  </View>
                ))
              ) : activeFilter === 'Location' ? (
                locationOptions.map((option) => (
  <TouchableOpacity
    key={option}
    onPress={() => handleSelect(option)}
    style={styles.optionItemRow}
  >
    <Text style={styles.optionItemText}>{option}</Text>
    {selectedLocation.includes(option) && <Text>✓</Text>}
    </TouchableOpacity>
  ))
) : (
                getOptions().map((option: string) => (
                  <TouchableOpacity
                    key={option}
                    onPress={() => handleSelect(option)}
                    style={styles.optionItemRow}
                  >
                    <Text style={styles.optionItemText}>{option}</Text>
                    {getSelectedArray().includes(option) && <Text>✓</Text>}
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
            <TouchableOpacity onPress={clearSelectedFilter}>
              <Text style={styles.clearBtn}>Clear Selection</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveFilter(null)}>
              <Text style={styles.cancelBtn}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
    minWidth: '23%',
    alignItems: 'center',
  },
  chipText: {
    fontSize: 14,
  },
  selectedText: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  subDetails: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  rating: {
    marginTop: 4,
    fontSize: 14,
    color: '#444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  optionItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionItemText: {
    fontSize: 16,
  },
  clearBtn: {
    marginTop: 8,
    textAlign: 'center',
    color: '#FF3B30',
    fontSize: 14,
  },
  cancelBtn: {
    marginTop: 12,
    textAlign: 'center',
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
