import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { userService } from '../services/userService';
import { useAuth } from './useAuth';

export const useFavorites = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
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
      } catch (err) {
        toast.error(err.response?.data?.message ?? t('common.error'));
      } finally {
        setLoadingId(null);
      }
    },
    [user, isFavorite, t]
  );

  return { isFavorite, toggle, loadingId };
};
