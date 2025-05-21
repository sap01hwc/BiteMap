import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#111827',
  accent: '#EF4444',
  background: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#D1D5DB',
};

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search restaurants..."
          style={styles.searchInput}
        />
        <Ionicons name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        {/* Placeholder */}
        <View style={styles.card} />

        <Text style={styles.sectionTitle}>Your Favorite Foods</Text>
        <View style={styles.card} />

        <Text style={styles.sectionTitle}>Suggested in Your Suburb</Text>
        <View style={styles.card} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="home" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="person" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 25,
    paddingHorizontal: 16,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  searchIcon: {
    marginLeft: 8,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#F3F4F6',
    height: 120,
    borderRadius: 16,
    marginBottom: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});
