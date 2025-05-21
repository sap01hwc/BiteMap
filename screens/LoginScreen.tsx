// LoginScreen.tsx
import React, { useState, useEffect } from 'react';
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
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth, db } from '../firebaseInit';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { doc, setDoc, getDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_REAL_EXPO_CLIENT_ID_HERE',
    iosClientId: 'YOUR_REAL_IOS_CLIENT_ID_HERE',
    androidClientId: 'YOUR_REAL_ANDROID_CLIENT_ID_HERE'
  });

  useEffect(() => {
    console.log('✅ Login screen rendered');
    console.log('Auth response:', response);
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (userCred) => {
          const user = userCred.user;
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              email: user.email,
              foodPreferences: [],
              suburbPreferences: []
            });
            navigation.navigate('FoodPreferences');
          } else {
            navigation.navigate('Home');
          }
        })
        .catch((error) => Alert.alert('Google Login Failed', error.message));
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => promptAsync()}>
          <Text style={styles.secondaryButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('EmailSignUp')}>
          <Text style={styles.secondaryButtonText}>Sign up with Email</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('FoodPreferences')}>
          <Text style={styles.skip}>Skip for now →</Text>
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
    fontSize: 28,
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
  secondaryButton: {
    width: CONTAINER_WIDTH,
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 14,
    marginBottom: 10,
  },
  secondaryButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: COLORS.primary,
  },
  skip: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
});
