import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  setItem: async (key: string, value: string) => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (e) {
      console.error(`❌ Error setting ${key}:`, e);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ?? null;
    } catch (e) {
      console.error(`❌ Error getting ${key}:`, e);
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (e) {
      console.error(`❌ Error removing ${key}:`, e);
    }
  },
};
