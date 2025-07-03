import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITE_KEY = 'favorite';

export class FavoriteStorage {
  static async getFavorite(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(FAVORITE_KEY);
    } catch {
      return null;
    }
  }

  static async setFavorite(id: string): Promise<void> {
    try {
      await AsyncStorage.setItem(FAVORITE_KEY, id);
    } catch (e) { console.error(e); }
  }

  static async removeFavorite(): Promise<void> {
    try {
      await AsyncStorage.removeItem(FAVORITE_KEY);
    } catch (e) { console.error(e); }
  }

  static async isFavorite(id: string): Promise<boolean> {
    const fav = await this.getFavorite();
    return fav === id;
  }
}