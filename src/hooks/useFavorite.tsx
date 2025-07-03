import React, { createContext, useContext, useEffect, useState } from 'react';
import { FavoriteStorage } from '@/services/favoriteStorage';

interface FavContext {
  favoriteId: string | null;
  setFavorite: (id: string) => Promise<void>;
  removeFavorite: () => Promise<void>;
}

const FavoriteContext = createContext<FavContext>({
  favoriteId: null,
  setFavorite: async () => {},
  removeFavorite: async () => {},
});

export function FavoriteProvider({ children }: { children: React.ReactNode }) {
  const [favoriteId, setFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    FavoriteStorage.getFavorite().then(setFavoriteId);
  }, []);

  const setFavorite = async (id: string) => {
    await FavoriteStorage.setFavorite(id);
    setFavoriteId(id);
  };

  const removeFavorite = async () => {
    await FavoriteStorage.removeFavorite();
    setFavoriteId(null);
  };

  return (
    <FavoriteContext.Provider
      value={{ favoriteId, setFavorite, removeFavorite }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export const useFavorite = () => useContext(FavoriteContext);