import { useState, useEffect, useCallback } from 'react';
import { recipeService } from '../services/recipeService';

export const useRecipes = (params = {}, deps = []) => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getAll(params);
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading recipes');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { recipes, pagination, loading, error, refetch: fetch };
};

export const useMyRecipes = (params = {}, deps = []) => {
  const [recipes, setRecipes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getMine(params);
      setRecipes(data.recipes);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading recipes');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { fetch(); }, [fetch]);

  return { recipes, pagination, loading, error, refetch: fetch };
};
