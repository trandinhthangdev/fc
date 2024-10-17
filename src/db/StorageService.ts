import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private static instance: StorageService | null = null;

  // Singleton instance getter
  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // Method to set an item in AsyncStorage
  public async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, stringValue);
    } catch (error) {
      console.error('Error setting item in AsyncStorage:', error);
    }
  }

  // Method to get an item from AsyncStorage
  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value != null ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error('Error getting item from AsyncStorage:', error);
      return null;
    }
  }

  // Method to remove an item from AsyncStorage
  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from AsyncStorage:', error);
    }
  }

  // Method to clear all items in AsyncStorage
  public async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  }
}

export default StorageService;
