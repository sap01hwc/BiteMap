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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseInit';

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

export default function EmailSignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create empty profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        foodPreferences: [],
        suburbPreferences: []
      });

      navigation.navigate('FoodPreferences');
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Create Your Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.skip}>← Back to Login</Text>
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
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: COLORS.textPrimary,
    maxWidth: CONTAINER_WIDTH,
  },
  input: {
    width: CONTAINER_WIDTH,
    height: 50,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#F9FAFB',
  },
  button: {
    width: CONTAINER_WIDTH,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: COLORS.background,
    fontSize: 16,
    textAlign: 'center',
  },
  skip: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
