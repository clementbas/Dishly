import { useState, useCallback } from 'react';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const [loadingId, setLoadingId] = useState(null);

  const isFavorite = useCallback(
    (recipeId) => user?.favorites?.some((f) => (f._id || f) === recipeId) ?? false,
    [user]
  );

  const toggle = useCallback(
    async (recipeId, onUpdate) => {
      if (!user) return;
      setLoadingId(recipeId);
      try {
        if (isFavorite(recipeId)) {
          await userService.removeFavorite(recipeId);
          onUpdate?.('removed');
        } else {
          await userService.addFavorite(recipeId);
          onUpdate?.('added');
        }
      } finally {
        setLoadingId(null);
      }
    },
    [user, isFavorite]
  );

  return { isFavorite, toggle, loadingId };
};
