import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
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

const SUBURBS = [
  'Brisbane City', 'South Bank', 'West End', 'Fortitude Valley',
  'New Farm', 'Woolloongabba', 'Spring Hill', 'Toowong',
  'Milton', 'South Brisbane', 'Kangaroo Point', 'Highgate Hill'
];

export default function SuburbPreferencesScreen({ navigation }) {
  const [selectedSuburbs, setSelectedSuburbs] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const toggleSelection = (item: string) => {
    setSelectedSuburbs(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const filteredSuburbs = SUBURBS.filter(s =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  const handleNext = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('No user logged in');

      await updateDoc(doc(db, 'users', user.uid), {
        suburbPreferences: selectedSuburbs
      });

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Which suburbs do you usually look for food in?</Text>

        <TextInput
          style={styles.input}
          placeholder="Search suburb..."
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.chipContainer}>
          {filteredSuburbs.map((suburb) => (
            <TouchableOpacity
              key={suburb}
              onPress={() => toggleSelection(suburb)}
              style={[styles.chip, selectedSuburbs.includes(suburb) && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, selectedSuburbs.includes(suburb) && styles.chipTextSelected]}
              >
                {suburb}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Go to Home</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
    maxWidth: CONTAINER_WIDTH,
  },
  input: {
    width: CONTAINER_WIDTH,
    height: 44,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
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
