import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { auth, db } from '../firebaseInit';
import { doc, updateDoc } from 'firebase/firestore';

const COLORS = {
  primary: '#111827',
  accent: '#EF4444',
  background: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
};

const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = Math.min(width * 0.9, 400);

const FOOD_TYPES = [
  'Chinese', 'Japanese', 'Korean', 'Thai', 'Malaysian',
  'Italian', 'American', 'Indian', 'Vietnamese', 'Mexican'
];

export default function FoodPreferencesScreen({ navigation }) {
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);

  const toggleSelection = (item: string) => {
    setSelectedFoods(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleNext = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateDoc(doc(db, 'users', user.uid), {
        foodPreferences: selectedFoods
      });

      navigation.navigate('SuburbPreferences');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>What foods do you like?</Text>

        <View style={styles.chipContainer}>
          {FOOD_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => toggleSelection(type)}
              style={[styles.chip, selectedFoods.includes(type) && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, selectedFoods.includes(type) && styles.chipTextSelected]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext}>
          <Text style={styles.skip}>Skip →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: CONTAINER_WIDTH,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: 20,
    maxWidth: CONTAINER_WIDTH,
  },
  chip: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  chipTextSelected: {
    color: COLORS.background,
  },
  button: {
    width: CONTAINER_WIDTH,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    textAlign: 'center',
  },
  skip: {
    textAlign: 'center',
    marginTop: 16,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
