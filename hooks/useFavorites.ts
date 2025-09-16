import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export interface FavoriteProduct {
  id: string;
  nome: string;
  preco: string;
  precoOriginal?: string;
  imagem: any;
  categoria: string;
  emPromocao?: boolean;
  estoque: number;
  favorito: boolean;
  avaliacao?: number;
  numAvaliacoes?: number;
}

const FAVORITES_STORAGE_KEY = '@ecobrick_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar favoritos do AsyncStorage
  useEffect(() => {
    loadFavorites();
  }, []);

  // Salvar favoritos no AsyncStorage sempre que mudar
  useEffect(() => {
    if (!loading) {
      saveFavorites();
    }
  }, [favorites, loading]);

  const loadFavorites = async () => {
    try {
      const favoritesData = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (favoritesData) {
        setFavorites(JSON.parse(favoritesData));
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  };

  const addToFavorites = (product: FavoriteProduct) => {
    setFavorites(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) return prev;
      
      return [...prev, { ...product, favorito: true }];
    });
  };

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
  };

  const toggleFavorite = (product: FavoriteProduct) => {
    const isFavorite = isInFavorites(product.id);
    
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isInFavorites = (productId: string) => {
    return favorites.some(item => item.id === productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const getFavoritesCount = () => {
    return favorites.length;
  };

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isInFavorites,
    clearFavorites,
    getFavoritesCount,
  };
}
